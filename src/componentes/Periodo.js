import 'dayjs/locale/es';
import dayjs from 'dayjs';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../css/Periodo.css';
import styled from '@emotion/styled';
import axios from 'axios';

const StyledSelect = styled(Select)(({ theme }) => ({
    '& #lPeriodo':{
        color:"black",
        fontWeight:"bold",
        fontSize:"0.95em"
    },
    '& fieldset': {
        borderColor:"black",
        borderWidth:"3px"
    },
    '& select': {
        fontWeight:"bold",
        color:"black"
    }
  }));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root':{
        color:"black",
        fontWeight:"bold",
        fontSize:"0.95em"
    },
    '& fieldset': {
        borderColor:"black",
        borderWidth:"3px"
    },
    '& svg': {
        color:"black"
    },
    '& input': {
        fontWeight:"bold",
        color:"black"
    }
  }));

let Periodo = function() {

    dayjs.locale('es');

    const [fechaIni, setFechaIni] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [periodo, setPeriodo] = useState(1);

    const [alerta, setAlerta] = useState(false);
    const [statusAlerta, setStatusAlerta] = useState("warning");
    const [msmAlerta, setMsmAlerta] = useState("");

    let cambiarFechaIni = function(e){
        setFechaIni(e.$d);
    };

    let cambiarFechaFin = function(e){
        setFechaFin(e.$d);
    };

    let abrirALerta = function (){
        setAlerta(true);
    };

    let cerrarAlerta = function(event, tipo){
        
        if( tipo == "clickaway" )
            return;
        setAlerta(false);
    };

    let ajaxConsultaFecha = async function(){
        try {
            let pet = await axios.post("http://127.0.0.1:9090/consultarPeriodo");
            let resp = await pet.data;

            setFechaIni(new Date(resp.fechIni));
            setFechaFin(new Date(resp.fechFin));
            setPeriodo(resp.perido);
        } catch (error) {
            console.error(error);
        }
    };

    let ajax = async function(){
        try {
            let pet = await axios.post("http://127.0.0.1:9090/actualizarPeriodo", 
                                        {fechIni: fechaIni, fechFin: fechaFin, perido: periodo});
            setStatusAlerta( "success" );
            setMsmAlerta( "Operación exitosa" );
        } catch (error) {
            setStatusAlerta( "warning" );
            setMsmAlerta( "Operación erronea" );
        }
        abrirALerta();
    };
    
    let cambiarPeriodo = function(e){
        setPeriodo(e.target.value);
    };

    useEffect( () => {
        ajaxConsultaFecha();
    }, [] );

    return(
        <>
            <Grid container sx={{
                marginTop:"12vh",
                marginBottom:"7vh"
            }}>
                <Grid item xs={12}>
                    <Card sx={{ border: 3,  
                            borderColor: 'primary.main', 
                            height: '80vh',
                            marginRight: "7vh",
                            backgroundColor: "rgba(255, 255, 255, 0.7)" }} >
                        <CardContent>
                            <Box sx={{display:"flex", justifyContent:"center"}} >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <FormControl sx={{ width:"9%",
                                                    backgroundColor:"rgba(255, 255, 255, 0.3)"}}>
                                            <InputLabel id="lPeriodo" 
                                                sx={{fontSize:"20px", color:"black"}}>
                                                    Periodo
                                            </InputLabel>
                                            <StyledSelect
                                                labelId="lPeriodo"
                                                id="periodo"
                                                value={periodo}
                                                label="Periodo del ano"
                                                onChange={cambiarPeriodo}
                                                sx={{color:"black"}}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={2}>2</MenuItem>
                                            </StyledSelect>
                                        </FormControl>
                                        <StyledDatePicker label="Fecha inicio periodo"
                                            value={dayjs(fechaIni.toISOString())} 
                                            onChange={cambiarFechaIni}/>
                                        <StyledDatePicker label="Fecha fin periodo"
                                            value={dayjs(fechaFin.toISOString())}
                                            onChange={cambiarFechaFin} />
                                        <Button variant="contained" color="success" onClick={ajax} >
                                            Actualizar periodos
                                        </Button>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box>
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
        </>
    );
};

export default Periodo;