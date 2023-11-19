import App from './App';
import { EstadoCarga } from './EstadoCarga';

let Inicio = function(){
    return(
        <EstadoCarga>
            <App/>
        </EstadoCarga>
    );
};

export default Inicio;