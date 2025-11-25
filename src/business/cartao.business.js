import { CartaoRepository } from "../repositories/cartao.repository.js";


export const CartaoBusiness = {
    async criar (cartao, userid){
        return await CartaoRepository.criar(cartao,userid);
    },
    async listar(userid) {
        return await CartaoRepository.listar(userid);
    }

}