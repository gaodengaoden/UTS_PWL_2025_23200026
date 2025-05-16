"use client";
import styles from './PackagePage.module.css';
import { useEffect, useState } from 'react';

export default function PackagePage() {

    const[packages,setPackages] = useState([]);

  const [kode, setKode] = useState(false);
  const [ nama, setNama ] = useState('');
  const [ deskripsi, setDeskripsi ] = useState('');
  const [ msg, setMsg ] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchPackages = async () => {
    const res = await fetch('api/package');
    const data = await res.json();
    setPackages(data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/package/${editId}` : '/api/package';
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode, nama, deskripsi }),
    });

    if (res.ok) {
        setMsg('Berhasil disimpan!');
        setKode('');
        setNama('');
        setDeskripsi('');
        setEditId(null);
        setFormVisible(false);
        fetchPackages();
    } else {
        setMsg('Gagal menyimpan data');
    }
};

const handleEdit = (item) => {
    setKode(item.kode);
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setEditId(item.id);
    setFormVisible(true);
};

const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;

    await fetch(`/api/package/${id}`, {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });

    fetchPackages();
};

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
        <button
            className={styles.buttonToggle}
            onClick={() => setFormVisible(!formVisible)}>
            {formVisible ? 'Tutup Form' : 'Tambah Data'}
        </button>
        
        {formVisible && (
            <div className={styles.formWrapper}>
                <h3>Input Data Baru</h3>
                <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <span>Kode</span>
                    <input
                    type="code"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Nama Pemesan</span>
                    <input
                    type="text"
                    value={order_by}
                    onChange={(e) => setOrderBy(e.target.value)}
                    placeholder="Masukkan Nama Pemesan"
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <span>Deskripsi</span>
                    <input 
                        value={description}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        required
                    >
                    </input>
                </div>
                
                <button type="submit">
                    Simpan
                </button>
                <p>{msg}</p>
                </form>
            </div>
        )}

        <div className={styles.tableWrapper}>
            <table>
                <thead>
                <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                </tr>
                </thead>
                <tbody>
                    {packages.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.kode}</td>
                            <td>{item.nama}</td>
                            <td>{item.deskripsi}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                    {packages.length === 0 && (
                        <tr>
                            <td colSpan="7">Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>    
        </div>
    </div>
  );
}