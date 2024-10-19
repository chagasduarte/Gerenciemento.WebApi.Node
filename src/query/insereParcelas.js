function insereParcelas(DataCompra, IdDespesa, QtdParcelas, Valor)
{
  var valores = ""; 
  DataCompra = new Date(DataCompra);
  for (var i = 0; i < QtdParcelas; i++){
    valores += "(";

    valores += `${IdDespesa}, ${Valor}, ${DataCompra.setMonth(DataCompra.getMonth() + i)} , ${false},`

    valores += i == QtdParcelas-1? ")": "),";
  }
  console.log(valores)
  return `INSERT INTO "Parcelas" (DespesaId, Valor, DataVencimento, IsPaga) VALUES ${valores}`;
}
export default insereParcelas;
