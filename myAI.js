var inputs = readline().split(' ');
const width = parseInt(inputs[0]);
const height = parseInt(inputs[1]);
const myId = parseInt(inputs[2]);

let movs = ['N','S','E','W'];
let action='';
let action2='';
let charge='';
let minecoo=[];
let entrace=[];
let action3='';
let action4='';
let action5='';
let zonecoo=[[0,0,4,4],[0,5,4,9],[0,10,4,14],[5,0,9,4],[5,5,9,9],[5,10,9,14],[10,0,14,4],[10,5,14,9],[10,10,14,14]];
let torpx=-1;
let torpy=-1;
let minex=-1;
let miney=-1;
let hopplife=6;
let torpTesting='';
let trys=false;
let note = 0;
let cmpt;

let sonarLng=20;
let torpLng=4;
let mineLng=20;

let inclim=5;
let ictdCoef=100;
let inclim2=25;

let spaces = new Array(height);
for (let i =0;i<width;i++){
    spaces[i]=new Array(width);
}

for (let i = 0; i < height; i++) {
    const lines = readline().split('');
    for (let x = 0;x<height;x++){
        if (lines[x]==='.') {spaces[i][x]=1;}
        else {spaces[i][x]=-1;}
    }
}


let enspaces=[];
for (let y=0;y<height;y++){
    for (let x=0;x<width;x++){
        if(spaces[y][x]===1){
            enspaces.push([y,x]);
        }
    }
}

let startest = 0;
let starty = 1;
let startx = 1;

while (startest===0){
    if(spaces[starty][startx]===1 && spaces[starty-1][startx]===1 &&spaces[starty+1][startx]===1 &&spaces[starty][startx-1]===1 &&spaces[starty][startx+1]===1){
        console.log(starty+' '+startx);
        startest++;
        spaces[starty][startx]=0;
    }
    starty++;
    startx++;
}


function rdmInt(max){
    return Math.floor(Math.random()*Math.floor(max));
}


function incertitude(x,y){
    let res=0;
    if(enspaces.length<inclim2){
        for(let i=0;i<enspaces.length;i++){
            if(Math.abs(x-enspaces[i][1])+Math.abs(y-enspaces[i][0])<=inclim){
                res+=Math.floor(ictdCoef/cmpt);
            }
        }
    }
    return Math.floor(res/enspaces.length);
}

let listcoo=[];

function movTest(x,y,lim,places){
    if(cmpt<lim){
        cmpt++;
        let posMov=new Array(movs.length);
        for (let i=0;i<movs.length;i++){
            let ntx=x;
            let nty=y;
            if(movs[i]==='N'){
                nty--;
            }else if(movs[i]==='S'){
                nty++;
            }else if(movs[i]==='E'){
                ntx++;
            }else if(movs[i]==='W'){
                ntx--;
            }
        
            if(ntx>=0 && ntx<width && nty>=0 && nty<height && places[nty][ntx]===1){
                note+=200-incertitude(x,y);
                posMov[i]=[nty,ntx];
            }else{
                //note-=50;
                posMov[i]='NA';
            }
        }
        
        let list =[];
        for(let i=0;i<posMov.length;i++){
            let e = rdmInt(posMov.length);
            while(list.indexOf(e)!==-1){
                e = rdmInt(posMov.length);
            }
            
            list.push(e);
            if(posMov[e]!=='NA'){
                listcoo.push(posMov[e]);
                places[posMov[e][0]][posMov[e][1]]=0;
                movTest(posMov[e][1],posMov[e][0],lim,places);
                break;
            }
        }
    }
}

let cmpt2=0;
function movement(x,y,lim1,lim2,sil){
    let res ='';
    let finaly=[];
    let finalx=[];
    let fnote=-Infinity;
    
    for(let i =0;i<lim1;i++){
        
        let hspaces=new Array(height);
        for(let i =0;i<width;i++){
            hspaces[i]=[...spaces[i]];
        }
        
        note=0;
        listcoo=[];
        cmpt=0;
        movTest(x,y,lim2,hspaces);
        
        if(note > fnote && note!==0){
            finalx=listcoo[0][1];
            finaly=listcoo[0][0];
            fnote=note;
        }
        cmpt2++;
    }
    
    if (finaly+1===y){
        res='N';
        spaces[finaly][x]=0;
    }else if (finaly-1===y){
        res='S';
        spaces[finaly][x]=0;
    }else if (finalx-1===x){
        res='E';
        spaces[y][finalx]=0;
    }else if (finalx+1===x){
        res='W';
        spaces[y][finalx]=0;
    }else if(sil!==0){
        res='SURFACE';
        for (let y1 = 0; y1 < width; y1++) {
            for (let x1 = 0;x1<height;x1++){
                if (spaces[y1][x1]===0) {spaces[y1][x1]=1}
            }
        }
        spaces[y][x]=0;
    }else{
        res='NA';
    }
    
    return res;
}


function enMove(oppOrders){
    if (oppOrders.indexOf('MOVE')!==-1){
        let modx=0;
        let mody=0;
        if (oppOrders[oppOrders.indexOf('MOVE')+1]==='N'){
            mody=-1;
        }else if (oppOrders[oppOrders.indexOf('MOVE')+1]==='S'){
            mody=1;
        }else if (oppOrders[oppOrders.indexOf('MOVE')+1]==='E'){
            modx=1;
        }else if (oppOrders[oppOrders.indexOf('MOVE')+1]==='W'){
            modx=-1;
        }
        
        for (let i =0;i<enspaces.length;i++){
            enspaces[i][0]+=mody;
            enspaces[i][1]+=modx;
        }
        
    }else if(oppOrders.indexOf('SILENCE')!==-1){
        let lim=enspaces.length;
        for(let z=1;z<5;z++){
            for(let a=0;a<lim;a++){
                enspaces.push([(enspaces[a][0]-z),enspaces[a][1]]);
                enspaces.push([(enspaces[a][0]+z),enspaces[a][1]]);
                enspaces.push([enspaces[a][0],(enspaces[a][1]+z)]);
                enspaces.push([enspaces[a][0],(enspaces[a][1]-z)]);
            }
        }
        
        let testlist=[];
        for (let i=0;i<enspaces.length;i++){
            if(testlist.indexOf(enspaces[i][0]+' '+enspaces[i][1])!==-1){
                enspaces.splice(i,1);
                i--;
            }else{
                testlist.push(enspaces[i][0]+' '+enspaces[i][1]);
            }
        }
    }else if (oppOrders.indexOf('TORPEDO')!==-1){
        let torx=parseInt(oppOrders[oppOrders.indexOf('TORPEDO')+1]);
        let tory=parseInt(oppOrders[oppOrders.indexOf('TORPEDO')+2]);
        let torlist=[];
        for(let x=-4;x<5;x++){
            for(let y=-4;y<5;y++){
                torx=parseInt(oppOrders[oppOrders.indexOf('TORPEDO')+1]);
                tory=parseInt(oppOrders[oppOrders.indexOf('TORPEDO')+2]);
                if(Math.abs(x)+Math.abs(y)<=4){
                    torx+=x;
                    tory+=y;
                    torlist.push(tory+' '+torx);
                }
            }
        }
        for (let i=0;i<enspaces.length;i++){
            if(torlist.indexOf(enspaces[i][0]+' '+enspaces[i][1])===-1){
                enspaces.splice(i,1);
                i--;
            }
        }
    }else if(oppOrders.indexOf('SURFACE')!==-1){
        let ye=oppOrders[oppOrders.indexOf('SURFACE')+1]-1;
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]<zonecoo[ye][0] || enspaces[i][0]>zonecoo[ye][2] || enspaces[i][1]<zonecoo[ye][1] || enspaces[i][1]>zonecoo[ye][3]){
                enspaces.splice(i,1);
                i--;
            }
        }
    }
    
    for (let i =0;i<enspaces.length;i++){
        if(enspaces[i][0]<=-1 || enspaces[i][0]>=height || enspaces[i][1]<=-1 || enspaces[i][1]>=width){
            enspaces.splice(i,1);
            i--;
        }
    }
    
    for (let i=0;i<enspaces.length;i++){
        if(spaces[enspaces[i][0]][enspaces[i][1]]===-1){
             enspaces.splice(i,1);
             i--;
        }
    }
}


function rdmMine(x,y){
    let dir='';
    let list =[];
    for(let i=0;i<4;i++){
        let rdm = rdmInt(4);
        while(list.indexOf(rdm)!==-1){
            rdm = rdmInt(4);
        }
        list.push(rdm);
        
        if(rdm===0 && minecoo.indexOf([y-1,x])===-1 ){
            dir='N';
            minecoo.push([y-1,x]);
            break;
        }else if(rdm===1&& minecoo.indexOf([y+1,x])===-1){
            dir='S';
            minecoo.push([y+1,x]);
            break;
        }else if(rdm===2&& minecoo.indexOf([y,x+1])===-1){
            dir='E';
            minecoo.push([y,x+1]);
            break;
        }else if(rdm===3&& minecoo.indexOf([y,x-1])===-1){
            dir='W';
            minecoo.push([y,x-1]);
            break;
        }
    }
    return dir;
}


function torpTest(torpedoCooldown,x,y){
    let act='';
    if(torpedoCooldown===0 && enspaces.length<=torpLng){
        for (let i=0;i<enspaces.length;i++){
            if ((Math.abs(x-enspaces[i][1])+Math.abs(y-enspaces[i][0]))<=4){
                if(Math.abs(x-enspaces[i][1])>1 || Math.abs(y-enspaces[i][0])>1){
                    act='TORPEDO '+enspaces[i][1]+' '+enspaces[i][0];
                    torpx=enspaces[i][1];
                    torpy=enspaces[i][0];
                }
            }
        }
    }
    return act;
}

function sonarResultat(sonarInf,etat){
    let ye = sonarInf-1;
    if(etat===true){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]<zonecoo[ye][0] || enspaces[i][0]>zonecoo[ye][2] || enspaces[i][1]<zonecoo[ye][1] || enspaces[i][1]>zonecoo[ye][3]){
                enspaces.splice(i,1);
                i--;
            }
        }
    }else{
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]>=zonecoo[ye][0] && enspaces[i][0]<=zonecoo[ye][2] && enspaces[i][1]>=zonecoo[ye][1] && enspaces[i][1]<=zonecoo[ye][3]){
                enspaces.splice(i,1);
                i--;
            }
        }
    }
}

function bestSonar(){
    let res=1;
    let list=[];
    let lng=0;
    for(let ye=0;ye<zonecoo.length;ye++){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]>=zonecoo[ye][0] && enspaces[i][0]<=zonecoo[ye][2] && enspaces[i][1]>=zonecoo[ye][1] && enspaces[i][1]<=zonecoo[ye][3]){
                list.push(enspaces[i]);
            }
        }
        if(list.length>lng){
            res=ye+1;
            lng=list.length;
        }
        list=[];
    }
    return res;
}


let sonarcoo=rdmInt(9)+1;
let tour=0;
while (true) {
    var inputs = readline().split(' ');
    const x = parseInt(inputs[0]);
    const y = parseInt(inputs[1]);
    const myLife = parseInt(inputs[2]);
    const oppLife = parseInt(inputs[3]);
    const torpedoCooldown = parseInt(inputs[4]);
    const sonarCooldown = parseInt(inputs[5]);
    const silenceCooldown = parseInt(inputs[6]);
    const mineCooldown = parseInt(inputs[7]);
    const sonarResult = readline();
    
    if(sonarResult!=='NA'){
        if(sonarResult==='Y'){
            sonarResultat(sonarcoo,true);
        }else{
            sonarResultat(sonarcoo,false);
        }
    }
    if(torpTesting===true&&oppLife===hopplife){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]>=torpy-1 && enspaces[i][0]<=torpy+1 && enspaces[i][1]>=torpx-1 && enspaces[i][1]<=torpx+1){
                enspaces.splice(i,1);
                i--;
            }
        }
    }else if(torpTesting===true&&oppLife===hopplife-2){
        enspaces=[[torpy,torpx]];
    }else if(torpTesting===true&&oppLife===hopplife-1){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]<torpy-1 || enspaces[i][0]>torpy+1 || enspaces[i][1]<torpx-1 || enspaces[i][1]>torpx+1){
                if(enspaces[i][0]!==torpy && enspaces[i][1]!==torpx){
                    enspaces.splice(i,1);
                    i--;
                }
            }
        }
    }
    
    if(trys===true&&oppLife===hopplife){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]>=miney-1 && enspaces[i][0]<=miney+1 && enspaces[i][1]>=minex-1 && enspaces[i][1]<=minex+1){
                enspaces.splice(i,1);
                i--;
            }
        }
    }else if(trys===true&&oppLife===hopplife-2){
        enspaces=[[miney,minex]];
    }else if(trys===true&&oppLife===hopplife-1){
        for(let i=0;i<enspaces.length;i++){
            if(enspaces[i][0]<miney-1 || enspaces[i][0]>miney+1 || enspaces[i][1]<minex-1 || enspaces[i][1]>minex+1){
                if(enspaces[i][0]!==miney && enspaces[i][1]!==minex){
                    enspaces.splice(i,1);
                    i--;
                }
            }
        }
    }
    
    
    let oppoOrders = readline().split("|");
    let oppOrders=[];
    for (let i=0;i<oppoOrders.length;i++){
        oppOrders.push(oppoOrders[i].split(' '));
    }
    if(tour!==0){
        for(let i=0;i<oppOrders.length;i++){
            if (oppOrders[i][0].indexOf('MOVE')!==-1 || oppOrders[i][0].indexOf('TORPEDO')!==-1 || oppOrders[i][0].indexOf('SILENCE')!==-1){
                enMove(oppOrders[i]);
            }
            if(oppOrders[i][0].indexOf('SURFACE')!==-1){
                enMove(oppOrders[i]);
                entrace=[];
            }
        }
    }
    
        
    for (let i=0;i<enspaces.length;i++){
        if(entrace.indexOf(enspaces[i][0]+' '+enspaces[i][1])!==-1){
            enspaces.splice(i,1);
            i--;
        }
    }
    if(enspaces.length===1){
        entrace.push(enspaces[0][0]+' '+enspaces[0][1]);
    }
    
    if(mineCooldown===0){
        action='MINE '+rdmMine(x,y)+'|';
    }
    
    action3=torpTest(torpedoCooldown,x,y)+'|';
    
    if(enspaces.length<=mineLng){
        trys=false;
        for (let i=0;i<minecoo.length;i++){
            for (let e=0;e<enspaces.length;e++){
                if(minecoo[i][0]===enspaces[e][0] && minecoo[i][1]===enspaces[e][1]&&minecoo[i][0]!==y&&minecoo[i][1]!==x){
                    if (Math.abs(x-minecoo[i][1])>1||Math.abs(y-minecoo[i][0])>1){
                        trys=true;
                        action='TRIGGER '+minecoo[i][1]+' '+minecoo[i][0]+'|';
                        minex=minecoo[i][1];
                        miney=minecoo[i][0];
                        minecoo.splice(i,1);
                        break;
                    }
                }
            }
            if(trys===true){
                break;
            }
        }
    }
    //minecoo[i][0]<=enspaces[e][0]+1 && minecoo[i][0]>=enspaces[e][0]-1 && minecoo[i][1]<=enspaces[e][1]+1 && minecoo[i][1]>=enspaces[e][1]-1
    
    let mov='';
    let silrdm=rdmInt(2);
    if(silenceCooldown===0 && silrdm===0){
        action2=movement(x,y,1000,300,0);
        if(action2==='NA'){
            action2=''
            mov=movement(x,y,1000,300,1);
        }else if(action2==='N'){
            action2='SILENCE N 1 |';
            mov=movement(x,y-1,1000,300,1);
        }else if(action2==='S'){
            action2='SILENCE S 1 |';
            mov=movement(x,y+1,1000,300,1);
        }else if(action2==='E'){
            action2='SILENCE E 1 |';
            mov=movement(x+1,y,1000,300,1);
        }else if(action2==='W'){
            action2='SILENCE W 1 |';
            mov=movement(x-1,y,1000,300,1);
        }
    }else if(silenceCooldown===0 && silrdm===1){
        action2='SILENCE N 0|'
        mov=movement(x,y,1000,300,1);
    }else{
        mov=movement(x,y,1000,300,1);
    }
    if(mov!=='SURFACE'){
        if(action3==='|'){
            action3='';
            if(mov==='N'){
                action4='|'+torpTest(torpedoCooldown,x,y-1);
            }else if(mov==='S'){
                action4='|'+torpTest(torpedoCooldown,x,y+1);
            }else if(mov==='E'){
                action4='|'+torpTest(torpedoCooldown,x+1,y);
            }else if(mov==='W'){
                action4='|'+torpTest(torpedoCooldown,x-1,y);
            }
            if(action4==='|'){
                action4='';
            }
        }
        mov='MOVE '+mov;
    }
    if(action3===''&&action4===''){
        torpTesting=false;
    }else{
        torpTesting=true;
    }
    
    if(sonarCooldown===0 && enspaces.length>sonarLng){
        sonarcoo=bestSonar();
        action5='|SONAR '+sonarcoo
    }
    
    
    if(torpedoCooldown!==0){
        charge='TORPEDO';
    }else{
        let ya=rdmInt(3);
        if(ya===0 && sonarCooldown!==0){
            charge='SONAR'
        }else if(ya===1 && mineCooldown!==0){
            charge='MINE';
        }else{
            charge='SILENCE';
        }
    }
    
    
    if(mov!=='SURFACE'){
        console.log(action3+action+action2+mov+' '+charge+action4+action5);
    }else{
        console.log(mov);
        
    }
    console.error('nb pose enenmi : '+enspaces.length)
    action5='';
    action4='';
    action3='';
    action2='';
    action='';
    tour++;
    hopplife=oppLife;
}
