const form = document.getElementById("form");

var datos = [];
var marcas = [];
var marcasHTML = "";

const seleccionaMarca = ms => {
  let regiones = [];
  let regionesHTML = "";
  let marcaSeleccionada = ms;
  datos.map(dato => {
    //Almacena las regiones que contengan la marca seleccionada
    let marca = dato.marca;
    let region = dato.region;
    if (marca === marcaSeleccionada) {
      if (!regiones.includes(region)) {
        regiones.push(region);
      }
    }
  });
  regiones.sort(); //Ordena el array alfabeticamente
  regiones.map(region => {
    //Imprime una opcion en el select para cada region
    regionesHTML += `<option value="${region}">${region}</option>`;
  });
  form.innerHTML = `
      <div class="form-group-wrapper">
        <div class="form-group">
          <label for="marca">Marca</label>
          <select name="marca" id="marca">
            ${marcasHTML}
          </select>
        </div>
        <div class="form-group">
          <label for="region">Región</label>
          <select name="region" id="region">
            <option value="todas">Ver Todas</option>
            ${regionesHTML}
          </select>
        </div>
      </div>
      <div id="table" class="table"></div>
    `;
  document.querySelector("#marca").value = marcaSeleccionada;
  seleccionaRegion(marcaSeleccionada);
};

const seleccionaRegion = (marc, reg = "todas") => {
  const table = document.getElementById("table");
  table.innerHTML = "";
  let regiones = [];
  let modelos = [];
  if (reg === "todas") {
    datos.map(dato => {
      let marca = dato.marca;
      let region = dato.region;
      if (marca === marc) {
        if (!regiones.includes(region)) {
          regiones.push(region);
        }
      }
    });
  } else {
    regiones = [reg];
  }
  regiones.sort();
  regiones.map(r => {
    //Imprimir una fila por cada region
    let tiendas = [];
    table.innerHTML += `
        <div region="${r}" class="row">
          <div class="cell cell-left"><p>${r}</p></div>
        </div>
      `;
    datos.map(dato => {
      //Obtener tiendas y modelos en la(s) region(es)
      let marca = dato.marca;
      let region = dato.region;
      let tienda = dato.tienda;
      let modelo = dato.modelo;

      if (marca === marc) {
        if (region === r) {
          if (!tiendas.includes(tienda)) {
            tiendas.push(tienda);
          }
          if (!modelos.includes(modelo)) {
            modelos.push(modelo);
          }
        }
      }
    });
    tiendas.sort();
    modelos.sort();

    tiendas.map(tienda => {
      //Imprime las tiendas en la region que contengan la marca
      table.innerHTML += `
        <div tienda="${tienda}" class="row">
          <div class="cell cell-right"><p>${tienda}</p></div>
        </div>
      `;
    });
  });
  modelos.map(modelo => {
    //Imprime todos los modelos disponibles en la(s) region(es) seleccionada(s)
    document.querySelector(".row").innerHTML += `
      <div class="cell"><p>${modelo}</p></div>
    `;
  });
  for (
    let i = 1;
    i < document.querySelector(".row").getElementsByTagName("div").length;
    i++
  ) {
    //Imprime una celda vacia en cada tienda y region por cada modelo
    //Asigna el atributo "modelo" para cada celda de la fila "tienda"
    let storeCells = document.querySelectorAll(".cell-right");
    storeCells.forEach(cell => {
      cell.parentElement.innerHTML += `
        <div modelo="${modelos[i - 1]}" class="cell"><p></p></div>
      `;
    });
    //Imprime celda sin atributo "modelo" para cada celda de fila "region", exceptuando la primera
    let regionCells = document.querySelectorAll(".cell-left");
    for (let j = 1; j < regionCells.length; j++) {
      regionCells[j].parentElement.innerHTML += `
      <div class="cell"><p></p></div>
    `;
    }
  }

  let storeCells = document.querySelectorAll(".cell-right");
  storeCells.forEach(cell => {
    //Imprime un marcador en cada tienda que contenga el modelo de la columna
    let tienda = cell.parentElement.getAttribute("tienda");
    datos.map(dato => {
      if (dato.tienda == tienda) {
        if (dato.marca == marc) {
          if (reg !== "todas") {
            if (dato.region == reg) {
              cell.parentElement.querySelector(
                `[modelo="${dato.modelo}"]`
              ).innerHTML = "X";
            }
          } else {
            cell.parentElement.querySelector(
              `[modelo="${dato.modelo}"]`
            ).innerHTML = "X";
          }
        }
      }
    });
  });
};

fetch("./data.json")
  .then(response => response.json())
  .then(data => {
    datos = data.datos;
    datos.map(dato => {
      let marca = dato.marca;
      if (!marcas.includes(marca)) {
        marcas.push(marca);
      }
    });
    marcas.sort();
    marcas.map(marca => {
      //Imprime las marcas disponibles en el primer select que se muestra
      marcasHTML += `<option value="${marca}">${marca}</option>`;
    });
    document.getElementById("marca").innerHTML += marcasHTML;
  });

form.addEventListener("change", function (e) {
  let marcaSelect = document.getElementById("marca");
  if (e.target === marcaSelect) {
    let marcaSeleccionada = document.getElementById("marca").value;
    seleccionaMarca(marcaSeleccionada);
  }
});
form.addEventListener("change", function (e) {
  let regionSelect = document.getElementById("region");
  if (e.target === regionSelect) {
    let marcaSeleccionada = document.getElementById("marca").value;
    let regionSeleccionada = document.getElementById("region").value;
    seleccionaRegion(marcaSeleccionada, regionSeleccionada);
  }
});
