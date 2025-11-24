import { CartaoRepository } from "../repositories/cartao.repository.js";


export const CartaoBusiness = {
    async criar (cartao, userid){
        return CartaoRepository.criar(cartao,userid);
    },
    async listar(userid) {
        return CartaoRepository.listar(userid);
    }

}