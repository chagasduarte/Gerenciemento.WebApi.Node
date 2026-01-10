import { ObjetivosRepository } from "../repositories/objetivos.repository.js";


export const ObjetivosBusiness = {
    async criar (objetivo, userid){
        return await ObjetivosRepository.criar(cartao,userid);
    },
    async listar(userid) {
        return await ObjetivosRepository.listar(userid);
    }

}