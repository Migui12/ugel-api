const { config } = require("dotenv");

const getFecha = () => {
    return new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Lima' })
    );
};

const horarioHabil = () => {
    const fecha = getFecha();

    const dia = fecha.getDay();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();

    const minutosActuales = hora * 60 + minutos;

    const [hIni, mIni] = config.hora_inicio.split(':').map(Number); 
    const [hFin, mFin] = config.hora_fin.split(':').map(Number);

    const inicio = hIni * 60 + mIni;
    const fin = hFin * 60 + mFin;

    const esLaborable = dia >= 1 && dia <= 5;
    const enHorario = minutosActuales >= inicio && minutosActuales < fin;

    return esLaborable && enHorario;
};

module.exports = {
    horarioHabil
};