var RegMat=new Array(17);
var RegMod=new Array(17);
var RegCajon=new Array(17);
var RegH=new Array(17);
var RegHs=new Array(17);

var cortes="";
var Dis=["A1","A2","A3","A4","A5","A6","A7","A8","B1","B2","B3","C1","C2","C3","C4","C5","C6"];
var Ocu= new Array();
var total=0;
var totalcash=0;
var ttlcarro=0;


window.onbeforeunload = function(e)
{
    return "Esta por borrar los datos almacenados";
};

function Ejec()
{   //Entrada de datos
    var tbxcajon=document.getElementById("box");
    var tbxmodelo=document.getElementById("mod");
    var tbxmatricula=document.getElementById("mat");
    var tbxTotal=document.getElementById("tot");
    var tbxHora=document.getElementById("hora");
    
    //Opciones de acciones
    var entrada=document.getElementById("rbIn");
    var salida=document.getElementById("rbOut");
    var corte=document.getElementById("rbCut");
    //Auxiliares
    var txtCut=document.getElementById("tbxCut");
    var tm=new Date();

    Entrada();

    var cajon= tbxcajon.value;

    if(entrada.checked && Ocu.length<17)
    {
        if(tbxmatricula.value.length==0)
        {
            alert('Ingrese Matricula');
            document.getElementById("mat").focus();
            return;
        }
        else if(tbxmodelo.value.length==0)
        {
            alert('Ingresar Modelo');
            document.getElementById("mod").focus();
            return;
        }

        total+=1;
        Dis.shift();
        Ocu.push(cajon);
        var celda=document.getElementById(cajon);
        celda.style.backgroundColor="rgba(255,0,0,0.5)";
        var frr=Libre();
        if(frr!=-1)
        {
            RegMat[frr]=tbxmatricula.value;
            RegMod[frr]=tbxmodelo.value;
            RegCajon[frr]=tbxcajon.value;
            RegH[frr]=tm.getHours()+":"+tm.getMinutes();
            RegHs[frr]=parseInt(tm.getHours())*3600+parseInt(tm.getMinutes())*60;
        }
        else
        {
            alert("El estacionamiento se encuentra lleno");
        }
     
        clean();
        Entrada();
    }
    else if(Entrada.checked && Ocu.length==17)
    {
        alert('El estacionamiento se encuentra lleno');
        return;
    }
    else if(salida.checked)
    {
        var toutH=tm.getHours();//Obtenemos hora de salida
        var toutM=tm.getMinutes();//Obtenemos monutos de salida


        if(Ocu.length==0)
        {
            alert('El estacionamiento esta libre');
            nuevo();
            return;
        }

        if(tbxmatricula.value.length==0)
        {
            alert('Ingrese Matricula');
            document.getElementById("mat").focus();
            return;
        }

        var prot=Salida();

        if(prot==-1)
        {
            return;
        }

        var ind=RegMat.indexOf(tbxmatricula.value);//busca matricula en el arreglo de matriculas
        
        //cobro dependiendo del tiempo
        var tout=parseInt(toutH)*3600+parseInt(toutM)*60;//convertimos a valores enteros la hora de la salida
        var tin=RegHs[ind];//Obtenemos el valor entrero de la hora y minuto de entrada
        var ttal=Math.ceil((tout-tin+0.1)/3600)*10;//Calculamos el valor que se le cobrara al cliente
        totalcash+=ttal;
        tbxTotal.value=ttal;//impresion en la caja de texto de el cobro que se realizara

        ttlcarro+=1;
        cortes+=ttlcarro+"|"+RegMat[ind]+","+RegMod[ind]+","+RegCajon[ind]+","+RegH[ind]+","+toutH+":"+toutM+", $"+ttal+".00"+"\n\r";

        var box=RegCajon[ind];

        //Cambio color de cajon
        var celda=document.getElementById(RegCajon[ind]);
        celda.style.backgroundColor="rgba(0,255,0,0.5)";

        //Eliminacion de los registros del auto saliente
        RegMat.splice(ind,1);
        RegMod.splice(ind,1);
        RegCajon.splice(ind,1);
        RegH.splice(ind,1);
        RegHs.splice(ind,1);
        Ocu.splice(ind,1);
        Dis.unshift(box);

        Dis.sort();

    }
    else if(corte.checked)
    {
        cortes+="Carros que entraron: "+total+"\n\r";
        cortes+="Total a tener en caja: $"+totalcash+".00"+"\n\r";
        cortes+=tm+"\n\r";
        cortes+="--------------------------------------------------------------------\n";
        txtCut.value=cortes;
        download(tm,cortes);
    }

}

function download(filename,text){
    var element = document.createElement('a');
    element.style.display='none';
    element.setAttribute('href','data:text/plain;charset=utf-8, '+ encodeURIComponent(text));
    element.setAttribute('download',filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function clean()
{
    var tbxcajon=document.getElementById("box");
    var tbxmodelo=document.getElementById("mod");
    var tbxmatricula=document.getElementById("mat");
    var tbxTotal=document.getElementById("tot");
    var tbxHora=document.getElementById("hora");
    
    tbxmodelo.value="";
    tbxmatricula.value="";
    tbxcajon.value="";
    tbxTotal.value="";
    tbxHora.value="";
}

function nuevo()
{
    var cortes="";
    var Dis=["A1","A2","A3","A4","A5","A6","B1","B2","B3","B4","B5","C1","C2","C3","C4","C5","C6"];
}

function Libre()
{
    var index;
    for(var i=0; i<18; i++)
    {
        if(RegMat[i]==undefined)
        {
            index=i;
            break;
        }
        else
        {
            index=-1;
        }
    }
    return index;
}

function Entrada()
{
    var cajon=document.getElementById("box");
    var cajonV=Dis[0];
    var tbxHora=document.getElementById("hora");
    var lvtime=document.getElementById("time");
    var tm=new Date();
    lvtime.innerHTML="Hora entrada:";
    

    if(cajonV==undefined)
    {
        alert('El estacionamiento se encuentra lleno');
    }
    else
    {
        tbxHora.value=tm.getHours()+":"+tm.getMinutes();
        cajon.value=cajonV;
    }
}

function Salida()
{
    var tbxMat=document.getElementById("mat");
    var tbxmodelo=document.getElementById("mod");
    var tbxHora=document.getElementById("hora");
    var cajon=document.getElementById("box");
    var lvtime=document.getElementById("time");
    var out=RegMat.indexOf(tbxMat.value);
    lvtime.innerHTML="Hora salida:";
    var tm=new Date();
    var so=RegCajon[out];
    if(so==undefined)
    {
        alert("Matricula no encontrada");
        return -1;
    }
    else
    {
        tbxmodelo.value=RegMod[out];
        tbxHora.value=RegH[out]+" - "+tm.getHours()+":"+tm.getMinutes();
        cajon.value=so;
        return 0;
    }    
}

function startTime()
{
    var t=new Date();
    var h=t.getHours();
    var m=t.getMinutes();
    var s=t.getSeconds();

    m=checkTime(m);
    s=checkTime(s);
    document.getElementById('info').innerHTML=h+":"+m+":"+s;
    t=setTimeout('startTime()',100);
}

function checkTime(i)
{
    if(i<10)i="0"+i;
    return i;
}
