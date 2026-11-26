(() => {
  'use strict';
  const DATA_TABLE = 'app_data';
  const DATA_KEYS = ['happy-shopping-demo-v1', 'happy-shopping-demo-v2', 'happy-shopping-quotes-v1'];
  const config = window.HAPPY_SHOPPING_SUPABASE || {};
  const authRoot = document.getElementById('authRoot');
  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  let client = null;
  let activeUser = null;
  let syncTimer = null;
  let applyingCloud = false;
  let isReady = false;
  let lastCloudSnapshot = '';

  function esc(value = '') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function localPayload() {
    const result = {};
    for (const key of DATA_KEYS) {
      const value = nativeGet.call(localStorage, key);
      if (value !== null) result[key] = value;
    }
    return result;
  }
  function snapshot(value) { return JSON.stringify(value || {}); }
  function showGate(message, error = false) {
    authRoot.innerHTML = `<section class="auth-gate"><div class="auth-card"><div class="auth-logo">H<span>♥</span></div><p class="auth-eyebrow">APPLICATION PRIVÉE</p><h1>HAPPY SHOPPING</h1><p class="auth-subtitle">Connectez-vous avec le compte Google autorisé pour accéder à la gestion et synchroniser vos données.</p>${message ? `<div class="auth-message ${error ? 'is-error' : ''}">${esc(message)}</div>` : ''}<button id="googleSignIn" class="google-button" ${!client ? 'disabled' : ''}><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.88 13.72 17.45 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11.05 11.05 0 0 1-4.8 7.24l7.73 6C44.38 38.05 47 31.93 47 24.55Z"/><path fill="#FBBC05" d="M9.99 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.2a23.9 23.9 0 0 0 0 21.58l7.98-6.2Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.77l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.55 0-12.12-4.22-14.01-10.08l-7.98 6.2C6.51 42.62 14.62 48 24 48Z"/></svg>Continuer avec Google</button><p class="auth-footnote">La sauvegarde cloud est liée à votre compte Google et protégée par les règles d’accès Supabase.</p></div></section>`;
    document.getElementById('googleSignIn')?.addEventListener('click', signIn);
  }
  function renderAccount(user, status = 'Synchronisé') {
    const root = document.getElementById('cloudAccount');
    if (!root) return;
    const label = user.user_metadata?.full_name || user.email || 'Compte Google';
    const avatar = user.user_metadata?.avatar_url;
    root.innerHTML = `<div class="cloud-account"><span class="cloud-status" title="${esc(status)}">●</span>${avatar ? `<img src="${esc(avatar)}" alt="" referrerpolicy="no-referrer">` : '<span class="cloud-avatar">G</span>'}<span class="cloud-email">${esc(label)}</span><button type="button" class="cloud-signout" id="signOutButton">Déconnexion</button></div>`;
    document.getElementById('signOutButton')?.addEventListener('click', async () => {
      if (!confirm('Se déconnecter de HAPPY SHOPPING ? Les données déjà synchronisées resteront dans votre compte.')) return;
      await client.auth.signOut();
      location.reload();
    });
  }
  async function signIn() {
    if (!client) return;
    const button = document.getElementById('googleSignIn');
    if (button) { button.disabled = true; button.textContent = 'Connexion à Google…'; }
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.href.split('#')[0], queryParams: { prompt: 'select_account' } } });
    if (error) showGate(`Connexion impossible : ${error.message}`, true);
  }
  async function pullCloud() {
    if (!client || !activeUser) return null;
    const { data, error } = await client.from(DATA_TABLE).select('payload, updated_at').eq('user_id', activeUser.id).maybeSingle();
    if (error) throw error;
    return data?.payload || null;
  }
  async function pushCloud(payload = localPayload()) {
    if (!client || !activeUser || applyingCloud) return;
    const clean = Object.fromEntries(Object.entries(payload).filter(([key]) => DATA_KEYS.includes(key)));
    if (!Object.keys(clean).length) return;
    const currentSnapshot = snapshot(clean);
    if (currentSnapshot === lastCloudSnapshot) return;
    const { error } = await client.from(DATA_TABLE).upsert({ user_id: activeUser.id, payload: clean, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) {
      renderAccount(activeUser, 'Erreur de synchronisation');
      showToast(`Synchronisation impossible : ${error.message}`, true);
      return;
    }
    lastCloudSnapshot = currentSnapshot;
    renderAccount(activeUser, 'Synchronisé');
  }
  function schedulePush() {
    if (!isReady || !activeUser || applyingCloud) return;
    renderAccount(activeUser, 'Synchronisation…');
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => pushCloud().catch(error => {
      renderAccount(activeUser, 'Erreur de synchronisation');
      showToast(`Erreur de synchronisation : ${error.message}`, true);
    }), 650);
  }
  function showToast(message, error = false) {
    const root = document.getElementById('toastRoot');
    if (!root) return;
    const item = document.createElement('div'); item.className = `toast${error ? ' error' : ''}`; item.textContent = message; root.append(item); setTimeout(() => item.remove(), 5000);
  }
  async function refreshFromCloud() {
    if (!activeUser || !isReady || syncTimer) return;
    try {
      const remote = await pullCloud();
      if (!remote || snapshot(remote) === snapshot(localPayload())) return;
      applyingCloud = true;
      for (const key of DATA_KEYS) {
        if (Object.prototype.hasOwnProperty.call(remote, key)) nativeSet.call(localStorage, key, remote[key]);
        else localStorage.removeItem(key);
      }
      lastCloudSnapshot = snapshot(remote);
      location.reload();
    } catch (error) {
      renderAccount(activeUser, 'Hors ligne');
    }
  }
  function installAutoSync() {
    Storage.prototype.setItem = function (key, value) {
      const result = nativeSet.call(this, key, value);
      if (this === localStorage && DATA_KEYS.includes(String(key))) schedulePush();
      return result;
    };
    window.addEventListener('storage', event => {
      if (DATA_KEYS.includes(event.key)) schedulePush();
    });
    window.addEventListener('online', () => schedulePush());
    window.addEventListener('focus', refreshFromCloud);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFromCloud(); });
    setInterval(refreshFromCloud, 45000);
  }
  async function start() {
    if (!config.url || !config.anonKey || !window.supabase?.createClient) {
      showGate('La connexion Google n’est pas encore configurée. Le propriétaire doit renseigner le projet Supabase et activer Google OAuth.');
      return;
    }
    client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data: { session }, error } = await client.auth.getSession();
    if (error) { showGate(`Impossible de vérifier la session : ${error.message}`, true); return; }
    if (!session) { showGate('Votre session est sécurisée. Connectez-vous pour charger les données du compte.'); return; }
    activeUser = session.user;
    try {
      const remote = await pullCloud();
      if (remote) {
        applyingCloud = true;
        for (const key of DATA_KEYS) {
          if (Object.prototype.hasOwnProperty.call(remote, key)) nativeSet.call(localStorage, key, remote[key]);
          else localStorage.removeItem(key);
        }
        lastCloudSnapshot = snapshot(remote);
      } else {
        // Première connexion : conserver les données locales existantes et les sauvegarder sur ce compte.
        const local = localPayload();
        if (Object.keys(local).length) await pushCloud(local);
      }
      installAutoSync();
      renderAccount(activeUser, 'Synchronisé');
      authRoot.innerHTML = '';
      isReady = true;
      if (remote) location.reload();
    } catch (syncError) {
      showGate(`Les données n’ont pas pu être chargées depuis le cloud : ${syncError.message}. Vérifiez la configuration Supabase et les règles RLS.`, true);
    }
  }
  start();
})();
