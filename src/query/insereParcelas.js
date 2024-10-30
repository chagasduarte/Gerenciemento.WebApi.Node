function insereParcelas(DataCompra, IdDespesa, QtdParcelas, Valor)
{
  var valores = ""; 
  DataCompra = new Date(DataCompra);
  var x = 0;
  for (var i = 0; i < QtdParcelas; i++){
    valores += `( ${IdDespesa}, ${Valor}, '${ new Date(DataCompra.setMonth(DataCompra.getMonth() + x)).toISOString() }' , ${0}`;
    if (x == 0){
      x = 1;
    }
    valores += i == QtdParcelas-1? ")": "),";
  }
  console.log(valores)

  for (var i = 0; i < QtdParcelas; i++){
    console.log(new Date(DataCompra.setMonth(DataCompra.getMonth() + 1)));
  }
  return `INSERT INTO "Parcelas" ("DespesaId", "Valor", "DataVencimento", "IsPaga") VALUES ${valores}`;
}
export default insereParcelas;
