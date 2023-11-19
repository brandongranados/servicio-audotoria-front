import { Box, CircularProgress, Modal } from "@mui/material";
import { useEffect, useState } from "react";

let Cargando = function({estadoModal}){

    const [abrir, setAbrir] = useState(true);
    
    let abrirModal = () => setAbrir(true);
    let cerrarModal = () => setAbrir(false);

    useEffect( () => {
        if(estadoModal)
            abrirModal();
        else
            cerrarModal();
    }, [estadoModal] );

    return(
        <Modal
        open={abrir}
        aria-labelledby="etiquetaCarga"
        aria-describedby="cargando"
        >
            <CircularProgress
            sx={{margin:"auto", display:"block", padding:"7%"}}
            size={500}/>
        </Modal>
    );
};

export default Cargando;