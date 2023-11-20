
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box, Grid } from '@mui/material';

import Conversion from './Conversion';
import Periodo from './Periodo';
import Navegacion from './Navegacion';
import Cargando from './Cargando';
import { useEstadoCarga } from './EstadoCarga';

import '../css/App.css';

let App = function() {

  const { valor } = useEstadoCarga();

  return (
    <BrowserRouter>
      <Box sx={{paddingTop:"10vh", paddingBottom:"10vh"}}>
        <Grid container>
          <Grid item xs={4} sx={{paddingLeft:"3%", paddingRight:"1.5%"}}>
            <Navegacion />
          </Grid>
          <Grid item xs={8} sx={{paddingLeft:"1.5%", paddingRight:"3%"}}>
            <Routes>
              <Route path='/' element={<Conversion />} />
              <Route path='/administrador' element={<Periodo />} />
            </Routes>
          </Grid>
        </Grid>
        <Cargando estadoModal={valor} />
      </Box>
    </BrowserRouter>
  );
}

export default App;
