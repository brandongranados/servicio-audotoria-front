
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Grid } from '@mui/material';

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
      <Grid container>
        <Grid item xs={4}>
          <Navegacion />
        </Grid>
        <Grid item xs={8}>
          <Routes>
            <Route path='/' element={<Conversion />} />
            <Route path='/administrador' element={<Periodo />} />
          </Routes>
        </Grid>
      </Grid>
      <Cargando estadoModal={valor} />
    </BrowserRouter>
  );
}

export default App;
