import React from 'react';

const CalculationTable = ({ area, perimeter, volume }) => {
  return (
    <table className='results-table'>
      <tbody>
        <tr>
          <td>Property</td>
          <td>Value</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>{area}</td>
        </tr>
        <tr>
          <td>Perimeter</td>
          <td>{perimeter}</td>
        </tr>
        <tr>
          <td>Volume</td>
          <td>{volume}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CalculationTable;
