import { Modal, Button, Box } from "@mui/material";
import { useEffect } from "react";

let ModalError = function({ boolError, setBoolError, children }){
    
    let abrirModal = () => setBoolError(true);
    let cerrarModal = () => setBoolError(false);

    useEffect( () => {
        if(boolError)
            abrirModal();
        else
            cerrarModal();
    }, [boolError] );

    return(
        <Modal
        open={boolError}
        aria-labelledby="etiquetaErrores"
        aria-describedby="Errores"
        sx={{backgroundColor:"#000000b5", overflowY:"scroll", display:"flex", justifyContent:"center"}}
        >
            <Box>
                {children}
                <Button variant="outlined" color="error" 
                onClick={cerrarModal} size="large" sx={{width:"100%"}}>
                   Cerrar
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalError;