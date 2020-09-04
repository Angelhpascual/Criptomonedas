import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import axios from "axios";
import Error from "./Error";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  //State del estado de criptomonedas
  const [listaCripto, guardarCriptomonedas] = useState([]);
  const MONEDAS = [
    { codigo: "USD", nombre: "Dolar de Estados Unidos" },
    { codigo: "MXN", nombre: "Peso Mexicano" },
    { codigo: "EUR", nombre: "EURO" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
  ];

  //Utilizamos el custom hook useMoneda
  const [moneda, SelectMonedas, actualizarState] = useMoneda(
    "Elige tu Moneda",
    "",
    MONEDAS
  );

  //Utilizar useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige tu criptomoneda",
    "",
    listaCripto
  );

  //State para los errores
  const [error, setError] = useState(false);

  //Ejecutar llamado a la API
  useEffect(() => {
    const consultarApi = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

      const resultado = await axios.get(url);
      guardarCriptomonedas(resultado.data.Data);
    };
    consultarApi();
  }, []);

  //Cotizar moneda
  const cotizarMoneda = (e) => {
    e.preventDefault();
    //Validar si ambos campos están llenos
    if (moneda === "" || criptomoneda === "") {
      setError(true);
      return;
    }
    //Pasar los datos al componente principal
    setError(false);
    guardarMoneda(moneda);
    guardarCriptomoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCripto />
      <Boton type="submit" value="Calcular" />
    </form>
  );
};

export default Formulario;
