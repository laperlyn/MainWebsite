const RAW = [
 ['Rukmini Crimson Tussar Silk','silk',9800,12500,'Tussar Silk','Crimson tussar with hand-block floral motifs and a deep espresso border.',2],
 ['Meera Ivory Satin Embroidered','festive',7200,0,'Satin Silk','Ivory satin with a scalloped black border and scattered floral embroidery.',2],
 ['Anika Plum Chiffon Butta','festive',5600,0,'Chiffon','Sheer plum chiffon with gold buttas and a broad zari border.'],
 ['Neela Sapphire Banarasi','silk',17800,22500,'Banarasi Silk','Sapphire blue Banarasi with silver zari motifs and a richly woven pallu.'],
 ['Hari Olive Tissue Silk','silk',15400,0,'Tissue Silk','Olive-green tissue silk with antique gold zari and a shimmering drape.'],
 ['Vana Emerald Banarasi','wedding',21900,27500,'Banarasi Silk','Deep emerald Banarasi with dense gold motifs, made for the big occasions.'],
 ['Indira Navy Copper Zari','silk',19500,0,'Pure Silk','Navy silk woven with copper zari florals and a maroon-edged border.'],
 ['Lakshmi Scarlet Banarasi','wedding',23900,29900,'Banarasi Silk','Bridal scarlet Banarasi with classic gold buttis and a temple-style pallu.'],
 ['Ahana Violet Foil Silk','festive',8400,0,'Silk','Violet silk with gold foil-print motifs, styled with an ivory blouse.'],
 ['Rani Royal Purple Embroidered','wedding',16800,21000,'Silk Georgette','Royal purple with fine gold zardozi-style embroidery along border and pallu.'],
 ['Kaveri Royal Blue Silk','silk',6900,0,'Pure Silk','Lustrous royal blue silk with a maroon and gold woven border.'],
 ['Zara Teal Sequin Embroidered','festive',13200,0,'Organza','Teal organza with sequin and thread embroidery and a scalloped edge.'],
 ['Amrita Violet Embroidered','wedding',14600,0,'Silk Georgette','Deep violet with intricate gold embroidery and a tasselled blouse back.'],
 ['Tara Copper Kanjeevaram','silk',18200,23000,'Kanjeevaram Silk','Copper-toned silk with floral weave and a bottle-green zari border.'],
 ['Surya Saffron Cotton Silk','cotton',6200,0,'Cotton Silk','Saffron cotton silk with a geometric purple and gold border.'],
 ['Gul Crimson Cotton Silk','cotton',5900,0,'Cotton Silk','Crimson cotton silk with a pink-gold herringbone border.']
];
const PRODUCTS = RAW.map((r,i) => {
  const n = i+1;
  return {id:'p'+n, name:r[0], category:r[1], price:r[2], mrp:r[3]||null,
    images: r[6] ? [`images/p${n}-1.jpg`,`images/p${n}-2.jpg`] : [`images/p${n}-1.jpg`],
    fabric:r[4], blouse:'Unstitched / as shown', length:'6.3m + 0.8m blouse', desc:r[5]};
});
function getProduct(id){ return PRODUCTS.find(p => p.id === id); }
