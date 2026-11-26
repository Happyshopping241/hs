// Première ouverture : enregistrer automatiquement l'inventaire de référence.
// Ne remplace jamais une base déjà présente dans ce navigateur.
(() => {
  const storageKey = 'happy-shopping-demo-v2';
  const originalGetItem = Storage.prototype.getItem;
  let seeded = false;

  Storage.prototype.getItem = function (key) {
    const existing = originalGetItem.call(this, key);
    if (this === window.localStorage && key === storageKey && existing === null && !seeded) {
      seeded = true;
      const inventory = [
        ['Ricin','Huiles',24,5], ['Collagène','Produits finis',12,5], ['Aloe vera','Huiles',2,5], ['Romarin','Huiles',2,5], ['Glycérine','Huiles',2,5],
        ['Chebe','Poudre',10,5], ['Coco','Huiles',2,5], ['Moringa','Poudre',6,5], ['Escargot','Huiles',1,5], ['Avocat','Huiles',1,5],
        ['Curcuma','Poudre',8,5], ['Sésame','Huiles',7,5], ['Citron','Huiles',5,5], ['Fenugrec','Huiles',17,5], ['Oignon','Huiles',2,5],
        ['Nigelle','Huiles',1,5], ['Jojoba','Huiles',0,5], ['Carotte','Huiles',0,5], ['Baobab','Huiles',6,5], ['Barbarie','Huiles',9,5],
        ['Orange','Huiles',8,5], ['Gingembre','Huiles',5,5], ['Gants Kessa','Accessoires',0,3], ['Gommage Sivoderm','Produits finis',0,3],
        ['Gel douche','Produits finis',0,3], ['Gel visage charbon','Produits finis',0,3], ['Gel expert','Produits finis',0,3], ['Tebrima au Nila','Produits finis',0,3],
        ['Nila','Poudre',0,3], ['Fenugrec en poudre','Poudre',0,3], ['Graines de fenugrec','Poudre',0,3], ['Graines de chia','Poudre',0,3],
        ['Qasil','Poudre',0,3], ['Graines de lin','Poudre',0,3], ['Graines de nigelle','Poudre',0,3],
        ['Tissage','Mèches',0,3], ['Outré','Mèches',0,3], ['Superstar','Mèches',0,3], ['Italian Curl','Mèches',0,3], ['Body Waves','Mèches',0,3],
        ['Perruque bandeau semi-naturelle','Perruques',0,2], ['Perruque bandeau tresses','Perruques',0,2], ['Perruque bandeau naturelle','Perruques',0,2],
        ['Perruque full lace','Perruques',0,2], ['Perruque tresses sur closure','Perruques',0,2]
      ];
      const products = inventory.map(([name, category, stock, alert], index) => ({
        id: `P-${String(index + 1).padStart(4, '0')}`,
        name,
        category,
        sku: `HS-${String(index + 1).padStart(3, '0')}`,
        buyPrice: 0,
        sellPrice: 0,
        stock,
        alert,
        supplier: '',
        status: stock > 0 ? 'Disponible' : 'Épuisé'
      }));
      const inventoryDate = '2026-02-15';
      const initialData = {
        settings: {
          shopName: 'HAPPY SHOPPING', phone: '', whatsapp: '', defaultDelivery: 0,
          deliveryHours: 48, lowStock: 5, currency: 'FCFA', vat: 18,
          tps: 9.5, tpsEnabled: false,
          defaultExpenseCategory: 'Matériel et équipement', inventoryDate
        },
        products,
        clients: [],
        suppliers: [],
        orders: [],
        movements: products.filter(product => product.stock > 0).map((product, index) => ({
          id: `M-${String(index + 1).padStart(3, '0')}`,
          productId: product.id,
          productName: product.name,
          type: 'Entrée',
          quantity: product.stock,
          date: inventoryDate,
          note: 'Inventaire initial — 15 février 2026'
        }))
      };
      const serialized = JSON.stringify(initialData);
      this.setItem(storageKey, serialized);
      return serialized;
    }
    return existing;
  };
})();
