import React from 'react';

interface DataPegawaiProps {
  // Tambahkan props jika diperlukan
}

const DataPegawai: React.FC<DataPegawaiProps> = () => {
  return (
    <div className="w-full p-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-4">Data Pegawai</h1>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-white rounded-xl shadow">
        {/* Tambahkan elemen filter di sini */}
        <p>Filter Section</p>
      </div>

      {/* Table Section */}
      <div className="p-4 bg-white rounded-xl shadow">
        {/* Tabel data pegawai */}
        <p>Tabel Data Pegawai</p>
      </div>
    </div>
  );
};

export default DataPegawai;
