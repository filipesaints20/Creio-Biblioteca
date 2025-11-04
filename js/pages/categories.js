/**
 * [GET] Busca todas as categorias únicas e conta quantos livros há em cada.
 */
function getCategorias() {
  var aba = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ABA_LIVROS);
  var range = aba.getRange(2, 1, aba.getLastRow() - 1, aba.getLastColumn());
  var values = range.getValues();
  
  // Índice da coluna 'Categoria' (assumindo que seja a 3ª coluna, se Titulo=2, Autor=3)
  // AJUSTE ESTE ÍNDICE se a coluna Categoria não for a 3ª.
  var COL_CATEGORIA = 3; 

  var categoryCounts = {};
  
  for (var i = 0; i < values.length; i++) {
    // O valor da categoria estará na posição COL_CATEGORIA - 1 (por ser array base 0)
    var categoria = values[i][COL_CATEGORIA - 1]; 
    if (categoria && categoria.toString().trim() !== "") {
      var categoryName = categoria.toString().trim();
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    }
  }
  
  // Converte o objeto de contagem para o formato que seu frontend espera: [{ name: '...', book_count: X }, ...]
  var categoriasArray = Object.keys(categoryCounts).map(name => ({
    name: name,
    book_count: categoryCounts[name]
  }));
  
  return { "status": "sucesso", "dados": categoriasArray };
}
