import { Card, CardContent, MenuItem, MenuList, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import FolderIcon from '@mui/icons-material/Folder';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import '../css/Navegacion.css'
import { useEffect, useState } from "react";


let Navegacion = function(){

    const [sel, setSel] = useState([{i:1, val:"Cargar documentos", ruta:"/", 
                                        icon:<FolderIcon />, sel:true}, 
                                    {i:2, val:"Cambiar parametros", ruta:"/administrador",
                                        icon:<MiscellaneousServicesRoundedIcon />, sel:false}]);
    const ubicacion = useLocation();

    let linkSeleccionado = function (iterador) 
    {

        for(let f=0; f<sel.length; f++)
            sel[f].sel = false;

        let men = sel.filter( (i) => i.i < iterador.i );
        let man = sel.filter( (i) => i.i > iterador.i );

        iterador.sel = true;

        setSel( [...men, iterador, ...man] );
    };

    useEffect( () => {
        let ruta = ubicacion.pathname;
        let carga = sel.filter( (iterador) => iterador.ruta === ruta );

        linkSeleccionado(carga[0]);

    }, [] );

    return(
        <Card sx={{ border: 3,  
        borderColor: 'primary.main',
        height:"80vh",
        backgroundColor: "rgba(255, 255, 255, 0.7)" }} >
            <CardContent>
                <MenuList>
                    {
                        sel.map( (iterador) => (
                            <MenuItem onClick={function(){ linkSeleccionado(iterador) }}
                            className={ iterador.sel ? "seleccionado" : "" } 
                            key={iterador.i}>
                                <NavLink to={iterador.ruta}>
                                    <Typography variant="h4" 
                                    component="span" 
                                    sx={{color:"black"}}>
                                        { iterador.icon }
                                        { iterador.val }
                                    </Typography>
                                </NavLink>
                            </MenuItem>
                        ) )
                    }
                </MenuList>
            </CardContent>
        </Card>
    );
};

export default Navegacion;