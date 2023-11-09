import { useState } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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


let Conversion = function(){
    const [archBase64, setArchBase64] = useState("");
    const [tipoArchivo, setTipoArchivo] = useState("");
    const [nomArch, setNomArch] = useState("");

    const [alerta, setAlerta] = useState(false);
    const [statusAlerta, setStatusAlerta] = useState("warning");
    const [msmAlerta, setMsmAlerta] = useState("");

    const [tipoDoc, setTipoDoc] = useState(0);

    let cambiarTipoDoc = (e) => {
        setTipoDoc(e.target.value);
    };

    let abrirALerta = function (){
        setAlerta(true);
    };

    let cerrarAlerta = function(event, tipo){
        
        if( tipo == "clickaway" )
            return;
        setAlerta(false);
    };

    let leerArchivo = function(archivo){
        return new Promise((resolve, reject) => {
            let leer = new FileReader();
            leer.onload = (e) => {
              let resultado = leer.result;
              let cadenaArray = resultado.split(",");
              let type = archivo.type;
              let tipo = type.split("/");
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
        try {
            let obj = { archivo: archBase64, tipo: tipoArchivo, 
                        nombre: nomArch, fecha: fech.toISOString(), tipoPDF: tipoDoc };
            let peticion = await axios.post("http://localhost:9090/compartirExcel", obj);
            let respuesta = peticion.data;

            setStatusAlerta( "success" );
            setMsmAlerta( respuesta.msm );
        } catch (error) {
            setStatusAlerta( "warning" );
            setMsmAlerta( error.response.data.msm );
        }
        abrirALerta();
        setTipoArchivo("");
        setArchBase64("");
    };

    return(
        <Box pt={11} pb={8} >
            <Grid container>
                <Grid item sm={1} />
                <Grid item sm={10} className="carta">
                    <Card sx={{ border: 3,  
                            borderColor: 'primary.main', 
                            height: '80vh',
                            backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                        className="carta" >
                        <CardContent className="carta">
                            <Typography variant="h3" align="center" sx={{color:"white"}}>
                                <BusinessIcon fontSize="large" />
                                Departamento de Ciencias e Ingenier&iacute;a en Computaci&oacute;n
                            </Typography>
                        </CardContent>
                        <CardActions className="carta">
                            <FormControl sx={{width:"60%", 
                                                backgroundColor:"rgba(0, 0, 0, 0.35)"}}>
                                <InputLabel id="tipoDoc" sx={{fontSize:"20px", color:"white"}}>Seleccionar</InputLabel>
                                <Select
                                    labelId="tipoDoc"
                                    id="tipoDocId"
                                    value={tipoDoc}
                                    label="Seleccionar"
                                    onChange={cambiarTipoDoc}
                                    sx={{color:"white"}}
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
                <Grid item sm={1} />
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
        </Box>
    );
};

export default Conversion;