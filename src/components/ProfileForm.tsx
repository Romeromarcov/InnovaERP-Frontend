import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
  id_sucursal_predeterminada: string;
}

interface ProfileFormProps {
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => void;
  loading?: boolean;
  error?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialValues, onSubmit, loading, error }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <Input label="Nombre" name="first_name" value={values.first_name} onChange={handleChange} required />
      <Input label="Apellido" name="last_name" value={values.last_name} onChange={handleChange} required />
      <Input label="Email" name="email" value={values.email} onChange={handleChange} required />
      <Input label="Sucursal Predeterminada" name="id_sucursal_predeterminada" value={values.id_sucursal_predeterminada} onChange={handleChange} required />
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  );
};

export default ProfileForm;
