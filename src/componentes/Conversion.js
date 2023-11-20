import { useState } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import Card from '@mui/material/Card';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Button, CardActions, CardContent, Typography } from "@mui/material";

import { useEstadoCarga } from "./EstadoCarga";
import ModalError from "./ModalError";

let Conversion = function(){
    //MODAL RUEDA DE CARGANDO
    const { setValor } = useEstadoCarga();
    //MODAL DE ERRORES EN LA INTERPRETACION DE EXCEL
    const [boolError, setBoolError] = useState(false);
    const [valError, setValError] = useState([]);
    //CARGA DE ARCHIVOS
    const [archBase64, setArchBase64] = useState("");
    const [tipoArchivo, setTipoArchivo] = useState("");
    const [nomArch, setNomArch] = useState("");
    //MANIPULACION CUADRO DE ALERTA
    const [alerta, setAlerta] = useState(false);
    const [statusAlerta, setStatusAlerta] = useState("warning");
    const [msmAlerta, setMsmAlerta] = useState("");
    //IDENTIFICAR EL TIPO DE REPORTE A GENERAR
    const [tipoDoc, setTipoDoc] = useState(0);

    let cambiarTipoDoc = (e) => {
        setTipoDoc(e.target.value);
    };

    let abrirALerta = function (){
        setAlerta(true);
    };

    let cerrarAlerta = function(event, tipo){
        
        if( tipo === "clickaway" )
            return;
        setAlerta(false);
    };

    let leerArchivo = function(archivo){
        return new Promise((resolve, reject) => {
            let leer = new FileReader();
            leer.onload = (e) => {
              let resultado = leer.result;
              let cadenaArray = resultado.split(",");
              let type = archivo.name;
              let tipo = type.split(".");
              resolve({ archBase64: cadenaArray[1], tipoArchivo: tipo[1], nombre: archivo.name });
            };
            leer.onerror = (e) => {
              reject(new Error("Error al leer el archivo"));
            };
            leer.readAsDataURL(archivo);
          });
    };

    let cambiarRuta = async (e) => {
        
        let archivo = e.target.files[0];

        if( archivo )
            try {
                let { archBase64, tipoArchivo, nombre } = await leerArchivo(archivo);
                setArchBase64(archBase64);
                setTipoArchivo(tipoArchivo);
                setNomArch(nombre);
            } catch (error) {}
    };

    let ajax = async function(){
        let fech = new Date();
        setValor(true);
        try {
            let obj = { archivo: archBase64, tipo: tipoArchivo, 
                        nombre: nomArch, fecha: fech.toISOString(), tipoPDF: tipoDoc };
            let peticion = await axios.post("http://localhost:9090/compartirExcel", obj);
            let respuesta = peticion.data;

            setValor(false);
            setStatusAlerta( "success" );
            setMsmAlerta( respuesta.msm );
        } catch (error) {
            setValor(false);
            if( Object.keys(error.response.data).length > 1 )
                crearLogErrores(error.response.data);
            setStatusAlerta( "warning" );
            setMsmAlerta( error.response.data.msm );
        }
        abrirALerta();
        setTipoArchivo("");
        setArchBase64("");
    };

    let crearLogErrores = function(err){
        let array = Object.values(err);
        let errores = array.filter( (iterador) => iterador !== err.msm );
        
        setValError(errores);
        setBoolError(true);
    };

    return(
        <Box>
            <Grid container>
                <Grid item xs={12} className="carta">
                    <Card sx={{ border: 3,  
                            borderColor: 'primary.main', 
                            height:"80vh",
                            backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                        className="carta" >
                        <CardContent className="carta">
                            <Typography variant="h3" align="center" sx={{color:"black"}}>
                                <BusinessIcon fontSize="large" />
                                Departamento de Ciencias e Ingenier&iacute;a en Computaci&oacute;n
                            </Typography>
                        </CardContent>
                        <CardActions className="carta">
                            <FormControl sx={{width:"60%", 
                                                backgroundColor:"rgba(255, 255, 255, 0.3)"}}>
                                <InputLabel id="tipoDoc" sx={{fontSize:"20px", color:"black"}}>Seleccionar</InputLabel>
                                <Select
                                    labelId="tipoDoc"
                                    id="tipoDocId"
                                    value={tipoDoc}
                                    label="Seleccionar"
                                    onChange={cambiarTipoDoc}
                                    sx={{color:"black"}}
                                >
                                    <MenuItem value={0}>Elaboraci&oacute;n de Dict&aacute;menes COSIE ante el CTCE</MenuItem>
                                    <MenuItem value={1}>Servicios Bibliotecarios</MenuItem>
                                    <MenuItem value={2}>Actividades culturales y/o deportivas</MenuItem>
                                    <MenuItem value={3}>Pr&eacute;stamo de Equipo Inform&aacute;tico</MenuItem>
                                </Select>
                            </FormControl>
                            <Button component="label" variant="contained" 
                            startIcon={<CloudUploadIcon />}
                            size="large" >
                                Cargar Excel
                                <input type="file" style={{display:"none"}} onChange={cambiarRuta}
                                    accept=".csv" />
                            </Button>
                            <Button variant="contained" color="success" size="large"
                                    onClick={function(){ ajax() }} >
                                Crear PDF
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar spacing={2} sx={{ width: '70%' }}
                    autoHideDuration={5000}
                    onClose={function(){ cerrarAlerta() }}
                    open={ alerta }
                    anchorOrigin={ { vertical: 'top', horizontal: 'center' } } >
                <Alert onClose={function(){ cerrarAlerta() }}
                        severity={statusAlerta} sx={{ width: '100%' }}  >
                    {
                        msmAlerta
                    }
                </Alert>
            </Snackbar>
            <ModalError boolError={boolError} setBoolError={setBoolError}>
                <Typography sx={{ mt: 2, mb: 2, color:"white" }}>
                    {valError.map( (iterador) => (
                        <p>{iterador}</p>
                    ) )}
                </Typography>
            </ModalError>
        </Box>
    );
};

export default Conversion;