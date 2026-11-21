// Notizie dei competitor da Google News RSS → news.json. Uso: node news.js && node render.js
// Ogni notizia ha titolo, testata, data e link originale: nessun testo inventato.
const fs=require('fs');
const DAYS=365;
// q = query Google News; k = parole che devono comparire nel titolo (minuscole, senza accenti); x = esclusioni (omonimi); l = edizioni extra
const Q={
tavil:{q:"\"Tavil\" packaging OR paletizado OR palletizing",k:["tavil"]},
ulma:{q:"\"ULMA Packaging\"",k:["ulma"],x:/ulma (construction|forged|handling|architectural|c\.?y\.?e)/i},
bpa:{q:"\"BluePrint Automation\"",k:["blueprint automation", "bpa"],x:/bisphenol|bonneville|\bBPA-free/i},
schrage:{q:"\"Schrage\" Rohrkettenförderer OR \"tube chain conveyor\"",k:["schrage"]},
cama:{q:"\"Cama Group\" packaging",k:["cama"],x:/camas|camaro|camara/i},
mad:{q:"\"MAD Automation\"",k:["mad automation"]},
mespack:{q:"\"Mespack\"",k:["mespack"]},
meurer:{q:"\"meurer\" Verpackung OR packaging OR ITW",k:["meurer"],x:/reinhard meurer|meurer bau|zahnarzt/i},
miele:{q:"\"Miele Packaging\" OR \"Selematic\" confezionatrici",k:["miele packaging", "selematic"],x:/elettrodomestic|lavatric|lavastovigl|appliance|aspirapolvere/i},
mpe:{q:"\"Modern Process Equipment\" OR \"Chain-Vey\"",k:["modern process equipment", "chain-vey", "mpe"]},
newtecbag:{q:"\"Newtec Bag\" OR \"Newtec BAG Palletizing\"",k:["newtec"],x:/odense|fruit|potato|optical sort/i},
pfm:{q:"\"PFM\" packaging machinery OR confezionatrici Torrebelvicino",k:["pfm"],x:/pfm medical|pfm finance|private fund/i},
ricciarelli:{q:"\"Ricciarelli\" packaging OR confezionamento Pistoia",k:["ricciarelli"],x:/biscott|dolc|siena|mandorl|calciatore/i},
rovema:{q:"\"Rovema\" packaging OR Verpackungsmaschinen",k:["rovema"]},
schubert:{q:"\"Gerhard Schubert\" Verpackungsmaschinen",k:["schubert"],x:/franz schubert|schubert ag|schubert & salzer/i},
theegarten:{q:"\"Theegarten-Pactec\"",k:["theegarten"]},
somic:{q:"\"SOMIC\" Verpackungsmaschinen OR packaging",k:["somic"],x:/somic ishikawa/i},
tecnopack:{q:"\"Tecno Pack\" Schio confezionatrici",k:["tecno pack", "tecnopack"],x:/loreo|san salvo|pianoro|imballaggi in legno/i},
tiberpack:{q:"\"Tiber Pack\" packaging",k:["tiber pack", "tiberpack"]},
tmg:{q:"\"TMG Impianti\" pallettizzatori OR palletizer",k:["tmg"],x:/tmg spa|berbenno|valtellina|scavi/i},
massini:{q:'"MIAL" OR "MF TECNO" OR "Massini Industries" OR "MIAL Massini"',k:['mial','mf tecno','massini industries'],x:/cargo|freight|india|bari|monopattin|sindac|elezion|atletica|mumbai|airport|aeroport|airline|flight|navi |adani|csmia|terminal|moca|iata|carrier|nmia|slot/},
buhler:{q:'"Bühler Group" OR "Buhler Group" OR "Bühler AG" OR "Bühler Uzwil" OR Bühler feed',k:['buhler','bühler'],x:/martin buhler|alain buhler|schmid|udc|gran consiglio/,l:['de']},
andritz:{q:'Andritz feed OR Andritz pellet OR Andritz "pet food" OR Andritz aquafeed OR "Andritz Feed"',k:['andritz'],l:['de']},
wenger:{q:'"Wenger Manufacturing" OR Wenger extrusion OR Wenger extruder OR Wenger "pet food"',k:['wenger'],x:/arsene|fifa|arsenal|football|calcio|swiss army|knife|coltell/},
clextral:{q:'Clextral',k:['clextral'],l:['fr']},
ottevanger:{q:'"Ottevanger Milling" OR Triott OR Ottevanger feed',k:['ottevanger','triott'],x:/nina|riad|marocco/,l:['nl']},
coperion:{q:'Coperion',k:['coperion'],l:['de']},
vanaarsen:{q:'"Van Aarsen"',k:['van aarsen'],l:['nl']},
famsun:{q:'Famsun',k:['famsun']},
cablevey:{q:'Cablevey',k:['cablevey']},
concetti:{q:'"Concetti" Bastia OR "Concetti SpA" OR "Concetti S.p.A." OR "Concetti" insaccatrici OR "Concetti" packaging',k:['concetti spa','concetti s.p.a','concetti bastia','concetti packaging','concetti di bastia','concetti group']},
statec:{q:'"Statec Binder"',k:['statec']},
premiertech:{q:'"Premier Tech"',k:['premier tech'],x:/israel|summit|startup|bikes|ride |fenix|neff|gardiner|mercato|signs |jolanda|alpecin|cicl|cycl|van der poel|tour |giro|tappa|race|corridor|hackathon|velo|wielren/},
payper:{q:'Payper envasado OR Payper packaging OR Payper ensacado OR "Payper S.A."',k:['payper'],l:['es']},
fragola:{q:'"F.lli Fragola" OR "Fragola SpA" OR "Fragola S.p.A." OR Fragola mangimifici OR Fragola impianti',k:['f.lli fragola','fragola spa','fragola s.p.a','fratelli fragola','fragola impianti'],x:/basilicata|igp|consorzio|memorial|handbike|sport|ricett|torta|gelat|frutt|fragole|festa/},
paglierani:{q:'Paglierani packaging OR Paglierani Torriana OR "Paglierani srl" OR Paglierani confezionatrici',k:['paglierani'],x:/cheryl|mirella|confcooperative|caa/},
duravant:{q:'Duravant OR nVenia OR "Hamer-Fischbein" OR "Hamer Fischbein"',k:['duravant','nvenia','hamer','fischbein']},
coesia:{q:'Coesia',k:['coesia'],x:/mostra|menna|chiesa/},
ima:{q:'"IMA Group" OR "IMA S.p.A." OR "gruppo IMA" OR "IMA spa" OR "Vacchi" IMA',k:['ima ','ima,','ima:',' ima','gruppo ima']},
marchesini:{q:'"Marchesini Group" OR "Marchesini" packaging',k:['marchesini group','gruppo marchesini','marchesini spa']},
umbra:{q:'"Umbra Packaging"',k:['umbra packaging']},
haver:{q:'"Haver & Boecker" OR "Haver Boecker" OR "Haver&Boecker"',k:['haver'],l:['de']},
technipes:{q:'Technipes',k:['technipes'],x:/toselli|caffe|borbone|menghini|bionde|vicenza|bici|cicl|corridor|squadra|team|giro|tappa|classific|vinc|gara|race|stage|elite|under 23|u23|junior|chicchi|prestigio/}
};
// pagine aziendali LinkedIn (ultima parte di linkedin.com/company/...): post letti con ScrapeCreators se c'è SCRAPECREATORS_API_KEY
// fragola: pagina aziendale non trovata
const LI={ulma:['ulma-packaging'],massini:['mf-tecno','mial-massini','massini-industries'],buhler:['buhler'],andritz:['andritz'],wenger:['wenger-manufacturing'],clextral:['clextral'],ottevanger:['ottevanger-milling-engineers'],coperion:['coperion'],vanaarsen:['van-aarsen-international'],famsun:['famsun-group'],cablevey:['cablevey-conveyors'],concetti:['concetti-s-p-a'],statec:['statec-binder-gmbh'],premiertech:['premier-tech-systems-automation'],payper:['payperbagging'],paglierani:['paglierani-s.r.l.'],duravant:['duravant'],coesia:['coesia-s-p-a-'],ima:['imagroup'],marchesini:['marchesinigroup'],umbra:['umbra-packaging-s-r-l-'],haver:['haver-boecker'],technipes:['technipes-s.r.l.']};
const LI_EVERY=6*864e5; // LinkedIn una volta a settimana circa: ogni pagina letta costa 1 credito
const ED={it:'hl=it&gl=IT&ceid=IT:it',en:'hl=en-US&gl=US&ceid=US:en',de:'hl=de&gl=DE&ceid=DE:de',fr:'hl=fr&gl=FR&ceid=FR:fr',es:'hl=es&gl=ES&ceid=ES:es',nl:'hl=nl&gl=NL&ceid=NL:nl'};
// categoria OSINT: la prima regola che corrisponde vince
const CAT=[
['Rischio',/istruttoria|antitrust|contenzios|intimidaz|agitazion|spegne|occupazion|cessione|lavorator|tavolo|chiud|chiusura|vertenza|cigs|esodo|sindacat|\bfined\b|\bfines\b|boete|multa|sanzion|procura|indagin|investigation|prosecutor|licenzi|layoff|job cuts|sciopero|strike|recall|lawsuit|causa legale|crisi|crisis|cassa integrazione|insolven|bankrupt|fallimento|cyber|hacker|ransomware|incendio|fire at|esuberi|stellenabbau|kurzarbeit|despidos/],
['M&A',/takes over|compra |borsa|new brand|rebrand|nuovo marchio|unites|integrat|strategi|acquisi|acquire|merger|fusione|ubernahm|ubernimm|rachat|adquier|adquisici|takeover|stake|partecipazione|joint venture|cede |sells |sale of|vendita di|overname|neemt .* over/],
['Finanza',/revenue|ricavi|fatturato|utile|profit|results|risultati|bilancio|umsatz|ebit|ipo|bond|rating|dividend|earnings|orders intake|auftragseingang|facturaci|chiffre d'affaires|omzet/],
['Persone',/manager|\bceo\b|appoint|nomina|named|nominat|director|direttore|amministratore|president|presidente|board|geschaftsfuhr|vorstand|hires|joins|successor|successione|leadership/],
['Commessa',/order|contract|commessa|ordine|awarded|aggiudic|auftrag|fornitura|supplies|supply|delivers|consegna|commissioned|selected|chosen|pedido|commande|project for|progetto per/],
['Espansione',/partner|dealer|distribut|plant|stabilimento|facility|factory|opens|opening|inaugur|expan|espande|new site|headquarter|nuova sede|invest|werk|fabrik|usine|planta|fabriek|subsidiary|filiale|branch/],
['Fiera',/webinar|showcase|gulfood|cphi|braubeviale|to exhibit|in mostra|fair|fiera|expo|messe|salon|feria|exhibition|victam|ippe|interpack|ipack|pack expo|viv |viv-|eurotier|agritechnica|booth|stand |beurs|achema|powtech|anuga/],
['Corporate',/memory|memoria|scompars|anniversar|anniversario|\d+ anni|\d+ years|years of|award|premio|riconosciment|ranking|classifica|best employer|dove si lavora/],
['Prodotto',/launch|lancia|lancio|unveil|presenta|introduc|innovat|new line|nuova linea|nuovo|nuova|new |neue|nouvelle|nueva|patent|brevett|machine|macchina|technology|tecnologia/]
];
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const dec=s=>s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim();
const SPAM=/market outlook|market size|market report|market to reach|cagr|forecast 20|market research|market analysis/;
const keep=(id,nt)=>Q[id]&&Q[id].k.some(k=>nt.includes(norm(k)))&&!(Q[id].x&&Q[id].x.test(nt))&&!SPAM.test(nt);
const tag=(x,t)=>{const m=x.match(new RegExp('<'+t+'[^>]*>([\\s\\S]*?)</'+t+'>'));return m?dec(m[1]):''};
async function feed(q,ed){
 const u='https://news.google.com/rss/search?q='+encodeURIComponent(q+' when:'+DAYS+'d')+'&'+ED[ed];
 for(let i=0;i<3;i++){try{const r=await fetch(u,{headers:{'user-agent':'Mozilla/5.0'}});if(r.ok)return await r.text()}catch(e){}await new Promise(r=>setTimeout(r,1500*(i+1)))}
 console.warn('  ! feed non raggiunto',ed,q);return '';}
// titolo del post: testo normalizzato (il grassetto unicode diventa normale), una riga, max ~220 caratteri
const liTitle=s=>{s=(s||'').normalize('NFKC').replace(/\s+/g,' ').trim();return s.length>220?s.slice(0,220).replace(/\s\S*$/,'')+'…':s};
// LI_FILE = post letti a mano (es. da Claude via MCP): un JSON per riga [id, data, url, testo]
const liFile=()=>{const g={};for(const l of fs.readFileSync(process.env.LI_FILE,'utf8').split('\n').filter(Boolean)){const[id,d,u,t]=JSON.parse(l);(g[id]=g[id]||[]).push({url:u,datePublished:d,text:t})}return g};
async function linkedin(out,seen,since){
 const key=process.env.SCRAPECREATORS_API_KEY,file=process.env.LI_FILE&&liFile();
 for(const id in LI)for(const slug of file?[id]:LI[id]){let n=0;
  try{let j;if(file)j={posts:file[id]||[]};else{const r=await fetch('https://api.scrapecreators.com/v1/linkedin/company/posts?url='+encodeURIComponent('https://www.linkedin.com/company/'+slug+'/'),{headers:{'x-api-key':key}});
   j=await r.json();if(!r.ok||!j.success)throw new Error(r.status+' '+(j.message||j.error||''))}
   for(const p of j.posts||[]){const t=liTitle(p.text),d=new Date(p.datePublished);
    if(isNaN(d)||d<since||(t.match(/\p{L}/gu)||[]).length<15)continue; // salta post solo emoji/hashtag
    const nt=norm(t),k=id+'|li|'+(p.id||p.url);if(seen.has(k))continue;seen.add(k);
    out.push({id,d:d.toISOString().slice(0,10),t,s:'LinkedIn',u:p.url,c:(CAT.find(r=>r[1].test(nt))||['Altro'])[0]});n++}
  }catch(e){console.warn('  ! LinkedIn',slug,e.message)}
  console.log('li '+slug.padEnd(30),n)}
}
(async()=>{
 const prev=fs.existsSync('news.json')?JSON.parse(fs.readFileSync('news.json','utf8')):{items:[]},old=prev.items;
 const out=[],seen=new Set(),since=Date.now()-DAYS*864e5;
 const liDue=process.env.LI_FILE||process.env.SCRAPECREATORS_API_KEY&&!(prev.liAt&&Date.now()-new Date(prev.liAt)<LI_EVERY);
 for(const id in Q){const c=Q[id];let n=0;
  for(const ed of ['it','en'].concat(c.l||[])){
   const xml=await feed(c.q,ed);
   for(const it of xml.split('<item>').slice(1)){
    let t=tag(it,'title'),src=tag(it,'source'),d=new Date(tag(it,'pubDate'));
    if(src&&t.endsWith(' - '+src))t=t.slice(0,-(src.length+3));
    const nt=norm(t);if(isNaN(d)||d<since||!keep(id,nt))continue;
    const key=id+'|'+nt.replace(/[^a-z0-9]/g,'').slice(0,70);if(seen.has(key))continue;seen.add(key);
    const cat=(CAT.find(r=>r[1].test(nt))||['Altro'])[0];
    out.push({id,d:d.toISOString().slice(0,10),t,s:src,u:tag(it,'link'),c:cat,l:ed});n++}
  }
  console.log(id.padEnd(12),n);}
 if(liDue)await linkedin(out,seen,since);
 // tieni anche le notizie già raccolte che il feed non restituisce più (finestra mobile di Google)
 for(const o of old){const nt=norm(o.t),li=o.s==='LinkedIn',key=li?o.id+'|li|'+o.u:o.id+'|'+nt.replace(/[^a-z0-9]/g,'').slice(0,70);
  if(li&&out.some(x=>x.u===o.u))continue;
  if(!seen.has(key)&&(li||keep(o.id,nt))){seen.add(key);o.c=(CAT.find(r=>r[1].test(nt))||['Altro'])[0];out.push(o)}}
 out.sort((a,b)=>a.d<b.d?1:-1);
 const liAt=liDue?new Date().toISOString():prev.liAt;
 // riscrive solo se ci sono novità: così l'automazione su GitHub committa solo quando serve
 if(JSON.stringify(out)===JSON.stringify(old)&&liAt===prev.liAt)return console.log('nessuna novità',out.length);
 fs.writeFileSync('news.json',JSON.stringify(Object.assign({at:new Date().toISOString(),items:out},liAt?{liAt}:{})));
 console.log('totale',out.length);
})();
