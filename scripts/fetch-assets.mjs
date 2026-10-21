import fs from 'node:fs/promises';
const assets = [
  ['heian', '平安神宮 01.JPG'],
  ['amanohashidate', 'Amanohashidate 20211008160710 (51811911021).jpg'],
  ['tofukuji', 'Tofukuji Kyoto01bs3200.jpg'],
  ['gyoen', 'Various autumn trees at Kyoto Gyoen National Garden in Kyoto, Japan (2019) - 116.jpg']
];
const credits=[];
for (const [id,title] of assets) {
  const url=new URL('https://commons.wikimedia.org/w/api.php');
  url.search=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1280',titles:'File:'+title});
  const response=await fetch(url,{headers:{'User-Agent':'KyotoAutumnTravelGuide/1.0'}});
  if(!response.ok) throw new Error('Metadata '+response.status);
  const json=await response.json();
  const info=Object.values(json.query.pages)[0].imageinfo[0];
  const photo=await fetch(info.thumburl||info.url);
  if(!photo.ok) throw new Error('Photo '+photo.status);
  await fs.writeFile('assets/'+id+'.jpg',Buffer.from(await photo.arrayBuffer()));
  const meta=info.extmetadata;
  credits.push({id,title,author:meta.Artist?.value,license:meta.LicenseShortName?.value,licenseUrl:meta.LicenseUrl?.value,source:info.descriptionurl});
  console.log('Saved '+id);
}
await fs.writeFile('assets/photo-credits.json',JSON.stringify(credits,null,2));
