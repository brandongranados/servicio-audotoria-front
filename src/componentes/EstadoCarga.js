import { createContext, useContext, useState } from "react";

const ModalCarga = createContext();

let EstadoCarga = function({children}){
    const [valor, setValor] = useState(false);

    return(
        <ModalCarga.Provider value={{valor, setValor}}>
            {children}
        </ModalCarga.Provider>
    );
};

let useEstadoCarga = function(){
    return useContext(ModalCarga);
};

export {useEstadoCarga, EstadoCarga};