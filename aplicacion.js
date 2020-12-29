cont = 0;

function crea_matriz(filas, columnas) {
    matriz = new Array(filas);
    for (i = 0; i < filas; i++) {
        matriz[i] = new Array(columnas)
        for (j = 0; j < columnas; j++) {
            matriz[i][j] = 0;
        }
    }
}

function generaMatrizInputs() {
    var columnas = parseInt(document.getElementById('nd').value);
    var filas = parseInt(document.getElementById('nr').value);
    var fo = '';
    var aux = '';
    var matriz = '';
    var ceros = '';

    for (i = 1; i <= columnas; i++) {
        fo += '<input type="text" size="10" value="0" name="' + 'X' + i + '" id="' + 'X' + i + '" onClick="this.select();" required="required" style="text-align:right;" /> X' + i;
        ceros += 'X' + i;
        if (i != columnas) { fo += ' + '; ceros += ', '; }
    }

    document.getElementById('fo').innerHTML = '<p>Funcion Objetivo:</p>' + fo;

    for (i = 1; i <= filas; i++) {

        for (j = 1; j <= columnas; j++) {
            aux += '<input type="text" size="10" value="0" name="' + i + 'X' + j + '" id="' + i + 'X' + j + '" onClick="this.select();" required="required" style="text-align:right;" /> X' + j;

            if (j != columnas) { aux += ' + '; }
        }

        matriz += aux + ' ≤  <input type="text" size="10" value="0" name="' + 'R' + i + '" id="' + 'R' + i + '" onClick="this.select();" required="required"  /><br /><br />';
        aux = '';
    }

    document.getElementById('matriz').innerHTML = '<p>Restricciones:</p>' + matriz;
    ceros += ' ≥ 0';
    document.getElementById('ceros').innerHTML = ceros + '<p><input class="btn btn-success" type="button" value="Resolver" id="btIterar" onClick="iterar()" /></p><hr />';

    document.getElementById('nd').readOnly = true;
    document.getElementById('nr').readOnly = true;
}

function genera_matriz() {

    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);
    crea_matriz(restricciones + 2, variables + restricciones + 2);

    matriz[0][0] = 'Z';
    matriz[restricciones + 1][0] = 1;
    matriz[0][variables + restricciones + 1] = 'Solucion';

    for (i = 1; i <= variables; i++) {
        matriz[0][i] = 'X' + i;
    }
    for (i = 1; i <= restricciones; i++) {
        matriz[0][i + variables] = 'S' + i;
    }

    //Llenamos las restricciones y variables S	

    for (i = 1; i <= restricciones; i++) {
        for (j = 1; j <= variables; j++) {
            matriz[i][j] = document.getElementById(i + 'X' + j).value;
        }

        matriz[i][variables + restricciones + 1] = document.getElementById('R' + i).value;

        for (j = 1; j <= restricciones; j++) {
            matriz[i][i + variables] = 1;
        }
    }

    //Llenamos Z igualada a cero

    for (j = 1; j <= variables; j++) {
        matriz[restricciones + 1][j] = (document.getElementById('X' + j).value) * (-1);
    }

    imprime_tabla();
}
//Llenamos La Tabla con los Datos

function imprime_tabla() {

    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);
    var filas = restricciones + 2;
    var columnas = variables + restricciones + 2;
    var tabla = '<p>Tabla ' + cont + ':</p><table class="table-responsive">';

    for (i = 0; i < filas; i++) {
        tabla += '<tr class="Encabezado">';
        for (j = 0; j < columnas; j++) {
            tabla += '<td>' + matriz[i][j] + '</td>';
        }
        tabla += '</tr>';
    }

    tabla += '</table>';

    document.getElementById('tabla').innerHTML += tabla;
    cont++;
}

function esFin() {
    var objetivo = document.getElementById('objetivo').value;
    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);

    if (objetivo == 'max') {
        for (j = 1; j <= variables; j++) {
            if (matriz[restricciones + 1][j] < 0) { return false; }
        }
        return true;
    }

    if (objetivo == 'min') {
        for (j = 1; j <= variables; j++) {
            if (matriz[restricciones + 1][j] > 0) { return false; }
        }
        return true;
    }
}

function encuentraPivoteJ() {
    var objetivo = document.getElementById('objetivo').value;
    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);
    var itemFila = matriz[restricciones + 1][1];
    pivoteJ = 1;

    if (objetivo == 'max') {
        for (j = 1; j <= variables; j++) {
            if (matriz[restricciones + 1][j] < itemFila && matriz[restricciones + 1][j] != 0) { itemFila = matriz[restricciones + 1][j]; pivoteJ = j; }
        }
    }

    if (objetivo == 'min') {
        for (j = 1; j <= variables; j++) {
            if (matriz[restricciones + 1][j] > itemFila && matriz[restricciones + 1][j] != 0) { itemFila = matriz[restricciones + 1][j]; pivoteJ = j; }
        }
    }

}

function encuentraPivoteI() {
    var restricciones = parseInt(document.getElementById('nr').value);
    var variables = parseInt(document.getElementById('nd').value);
    var razon = 0;
    var aux = Number.MAX_VALUE;
    pivoteI = 0;

    for (i = 1; i <= restricciones; i++) {

        razon = parseFloat(parseFloat(matriz[i][restricciones + variables + 1] / matriz[i][pivoteJ]));

        if (razon > 0 && razon < aux) { aux = razon; pivoteI = i; }
    }
}

function divideFila(i, n) {
    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);
    var ncolumnas = variables + restricciones + 2;

    for (j = 0; j < ncolumnas; j++) {
        matriz[i][j] = parseFloat(matriz[i][j]) / n;
    }
}

function iterar() {

    document.getElementById('btIterar').disabled = true;

    genera_matriz();

    var variables = parseInt(document.getElementById('nd').value);
    var restricciones = parseInt(document.getElementById('nr').value);
    var ncolumnas = variables + restricciones + 2;
    var itemAux = 0;
    var respuesta = '<p>Solución: </p>';

    while (esFin() == false) {
        encuentraPivoteJ();
        encuentraPivoteI();
        divideFila(pivoteI, matriz[pivoteI][pivoteJ]);

        for (i = 1; i <= (restricciones + 1); i++) {
            itemAux = matriz[i][pivoteJ];
            for (j = 0; j < ncolumnas; j++) {
                if (i != pivoteI) {
                    //alert( matriz[i][j]+'-'+'('+matriz[i][pivoteJ] +'*'+ matriz[pivoteI][j]+')');
                    matriz[i][j] = matriz[i][j] - (itemAux * matriz[pivoteI][j]);
                }

            }

        }
        imprime_tabla();
    }

    for (j = 1; j <= variables; j++) {
        for (i = 1; i <= restricciones; i++) {
            if (matriz[i][j] == 1) {
                respuesta += matriz[0][j] + ' = ' + matriz[i][variables + restricciones + 1] + ' <br />';
            }
        }

    }

    respuesta += 'Z = ' + matriz[restricciones + 1][variables + restricciones + 1];
    document.getElementById('tabla').innerHTML += respuesta + '<p>Fin del Proceso!</p><p><input class="btn btn-info" type="button" value="Nuevo Problema" onClick="location.reload()" /></p><hr />';
}