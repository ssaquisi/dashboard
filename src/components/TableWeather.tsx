import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {

  let [rows, setRows] = useState<Item[]>([]);

  useEffect(() =>  {
    setRows(props.itemsIn);
  }, [props.itemsIn]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" sx={{ 
      backgroundColor: '#cad1de', // Fondo de la tabla
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra del contenedor
      borderRadius: '8px', // Bordes redondeados
      padding: '16px', // Espaciado interno
    }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#34495e' }}>
            <TableCell sx={{ fontWeight: 'bold', color:'#fff'  }}>Hora de inicio</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', color:'#fff' }}>Hora de fin</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', color:'#fff'  }}>Precipitación</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', color:'#fff' }}>Humedad</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', color:'#fff'  }}>Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateStart}
              </TableCell>
              <TableCell align="right">{row.dateEnd}</TableCell>
              <TableCell align="right">{row.precipitation}</TableCell>
              <TableCell align="right">{row.humidity}</TableCell>
              <TableCell align="right">{row.clouds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}