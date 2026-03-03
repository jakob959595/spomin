var IgralnoPolje;
var kartice=[];
var steviloParov=0;
var odprteKartice=[];
var najdeniPari=0;
var kliki=0;
var cas=0;
var igraSeVrti=false;
var casInterval=null;
var glasba=null;

var slike=['slike/goba.png','slike/jajca.png','slike/mavrica.png','slike/nevem.png','slike/oblak.png','slike/roza.png','slike/sladoled.png','slike/srce.png'];

function zacetek()
{
    IgralnoPolje = document.getElementById('igralno-polje');
    var str ='<h2>Navodila</h2>\n';
    str+='<p>Klikni na kartice in poiščite ujemajoče se pare.</p>\n';
    str+='<p>Kartice se zapirajo po 2 sekundah, če se ne ujemata.</p>\n';
    document.getElementById('navodila').innerHTML=str;
    document.getElementById('select-tezavnost').onchange = izbreriTezavnost;
    document.getElementById('btn-zacni').onclick = zacniIgro;
    document.getElementById('btn-reset').onclick = resetIgro;
    glasba = new Audio('glasba/carefree.mp3');
    glasba.volume = 0.067;
    glasba.loop = true;
}

function izbreriTezavnost()
{
    steviloParov = Number(this.value);
    document.getElementById('obvestilo').innerHTML='Izbral si '+steviloParov+' parov';
}

function zacniIgro()
{
    if(steviloParov==0){
        document.getElementById('obvestilo').innerHTML='Izberi tezavnost!';
        return;
    }
    resetIgro();
    document.getElementById('btn-zacni').disabled=true;
    pripraviKartice();
    premesiKartice();
    narediKarticeHTML();

    var vseKartice = document.querySelectorAll('.kartica');
    for(var i=0;i<vseKartice.length;i++){
        vseKartice[i].innerHTML='<img src="'+kartice[i].slika+'" alt="kartica">';
        vseKartice[i].className='kartica-odprta';
    }
    document.getElementById('obvestilo').innerHTML='Zapomni si kartice!';

    setTimeout(skrijkartice,2000);
}

function skrijkartice()
{
    var vseKartice = document.querySelectorAll('.kartica-odprta');
    for(var i=0;i<vseKartice.length;i++){
        vseKartice[i].innerHTML='?';
        vseKartice[i].className='kartica';
    }
        document.getElementById('obvestilo').innerHTML='';
        igraSeVrti=true;
        cas=0;
        meriCas();
        if(glasba){
            glasba.currentTime = 0;
            glasba.play();
        }
}

function pripraviKartice()
{
    kartice=[];
    for(var i=0;i<steviloParov;i++)
    {
        var k1={slika:slike[i],odprta:false,najdena:false};
        var k2={slika:slike[i],odprta:false,najdena:false};
        kartice.push(k1);
        kartice.push(k2);
    }
}

function premesiKartice()
{
    for(var i=kartice.length-1;i>0;i--)
    {
        var j=Math.floor(Math.random()*(i+1));
        var temp=kartice[i];
        kartice[i]=kartice[j];
        kartice[j]=temp;
    }
}

function narediKarticeHTML()
{
    var str='';
    IgralnoPolje.className='igralno-polje pari-'+steviloParov;
    for(var i=0;i<kartice.length;i++)
    {
        str+='<button class="kartica" data-stevilka-kartice="'+i+'" onclick="odpriKartico('+i+')">?</button>';
    }
    IgralnoPolje.innerHTML=str;
}

function odpriKartico(indeks)
{
    if(!igraSeVrti)return;
    if(kartice[indeks].odprta)return;
    if(kartice[indeks].najdena)return;
    if(odprteKartice.length>=2)return;

    kartice[indeks].odprta=true;
    odprteKartice.push(indeks);

    var gumb=document.querySelector('[data-stevilka-kartice="'+indeks+'"]');
    gumb.innerHTML='<img src="'+kartice[indeks].slika+'" alt="kartica">';
    gumb.className='kartica-odprta';

    kliki++;
    document.getElementById('kliki').innerHTML=kliki;

    if(odprteKartice.length==2){
        setTimeout(preveriParico,2000);
    }
}

function preveriParico()
{
    var indeks1=odprteKartice[0];
    var indeks2=odprteKartice[1];
    var kartica1=kartice[indeks1];
    var kartica2=kartice[indeks2];

    if(kartica1.slika==kartica2.slika){
        kartica1.najdena=true;
        kartica2.najdena=true;
        var g1=document.querySelector('[data-stevilka-kartice="'+indeks1+'"]');
        var g2=document.querySelector('[data-stevilka-kartice="'+indeks2+'"]');
        g1.className='kartica-najdena';
        g2.className='kartica-najdena';
        najdeniPari++;
        document.getElementById('pari').innerHTML=najdeniPari;
        if(najdeniPari==steviloParov){
            koncajIgro();
        }
    }else{
        var g1=document.querySelector('[data-stevilka-kartice="'+indeks1+'"]');
        var g2=document.querySelector('[data-stevilka-kartice="'+indeks2+'"]');
        g1.className='kartica';
        g2.className='kartica';
        g1.innerHTML='?';
        g2.innerHTML='?';
        kartica1.odprta=false;
        kartica2.odprta=false;
    }
    odprteKartice=[];
}

function meriCas()
{
    casInterval=setInterval(function(){
        if(!igraSeVrti){
            clearInterval(casInterval);
            return;
        }
        cas++;
        var minute=Math.floor(cas/60);
        var sekunde=cas%60;
        var str=minute+':';
        if(sekunde<10)str+='0';
        str+=sekunde;
        document.getElementById('cas').innerHTML=str;
    },1000);
}

function koncajIgro()
{
    igraSeVrti=false;
    if(glasba){
        glasba.pause();
    } 
    var obvestilo=document.getElementById('obvestilo');
    obvestilo.className='obvestilo zmaga';
    var str='<strong>CESTITKE!</strong>      ';
    str+='Našel si vse pare!  ';
    str+='<small>Cas: '+document.getElementById('cas').innerHTML+' | Kliki: '+kliki+'</small>';
    obvestilo.innerHTML=str;
    document.getElementById('btn-zacni').disabled=false;
}

function resetIgro()
{
    igraSeVrti=false;
    if(casInterval)clearInterval(casInterval);
    if(glasba){
        glasba.pause();
    }
    kartice=[];
    odprteKartice=[];
    najdeniPari=0;
    kliki=0;
    cas=0;
    document.getElementById('kliki').innerHTML='0';
    document.getElementById('pari').innerHTML='0';
    document.getElementById('cas').innerHTML='0:00';
    document.getElementById('obvestilo').innerHTML='';
    document.getElementById('obvestilo').className='obvestilo';
    IgralnoPolje.innerHTML='';
    document.getElementById('btn-zacni').disabled=false;
}
