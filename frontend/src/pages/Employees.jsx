import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee,
  searchEmployees,
  uploadEmployeePhoto
} from '../api';
import { clearToken } from '../auth';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Popover } from '../components/ui/popover';
import Calendar from '../components/ui/calendar';
import { useToast } from '../components/ui/toast';

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23e5e7eb'/><circle cx='100' cy='70' r='45' fill='%239ca3af'/><path d='M40 178c6-36 36-52 60-52s54 16 60 52' fill='%239ca3af'/></svg>";

const emptyEmployee = {
  first_name: '',
  last_name: '',
  email: '',
  position: '',
  salary: '',
  date_of_joining: '',
  department: ''
};

async function compressImage(file, maxSize = 512, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Image compression failed.'));
            const compressed = new File([blob], file.name || 'photo.jpg', { type: 'image/jpeg' });
            resolve(compressed);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState({ department: '', position: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.message || 'Could not load employees.');
        toast({ title: 'Failed to load employees', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let employeeId = editingId;
      if (editingId) {
        await updateEmployee(editingId, { ...form, salary: Number(form.salary) });
        toast({ title: 'Employee updated' });
      } else {
        const created = await createEmployee({ ...form, salary: Number(form.salary) });
        employeeId = created?.employee_id || employeeId;
        toast({ title: 'Employee created' });
      }
      if (photoFile && employeeId) {
        const compressed = await compressImage(photoFile);
        await uploadEmployeePhoto(employeeId, compressed);
        toast({ title: 'Photo uploaded' });
      }
      const data = await listEmployees();
      setEmployees(data);
      setForm(emptyEmployee);
      setEditingId('');
      setIsDialogOpen(false);
      setPhotoFile(null);
    } catch (err) {
      const msg = err.message || 'Save failed.';
      setError(msg);
      toast({ title: 'Save failed', description: msg, variant: 'destructive' });
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.employee_id);
    setForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining?.slice(0, 10) || '',
      department: emp.department
    });
    setSelected(emp);
    setIsDialogOpen(true);
    setPhotoFile(null);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
      if (selected?.employee_id === id) setSelected(null);
      toast({ title: 'Employee deleted' });
    } catch (err) {
      const msg = err.message || 'Delete failed.';
      setError(msg);
      toast({ title: 'Delete failed', description: msg, variant: 'destructive' });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!search.department && !search.position) {
        const data = await listEmployees();
        setEmployees(data);
        return;
      }
      const data = await searchEmployees(search);
      setEmployees(data);
    } catch (err) {
      const msg = err.message || 'Search failed.';
      setError(msg);
      toast({ title: 'Search failed', description: msg, variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-slate-100 backdrop-blur">
        Loading employees...
      </section>
    );
  }

  return (
    <div className="space-y-5 text-slate-100">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300"> Manage Employees</p>
          <p className="text-sm text-slate-200/80">Add, edit, delete, and view employees.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button
            variant="primary"
            onClick={() => { setForm(emptyEmployee); setEditingId(''); setIsDialogOpen(true); }}
          >
            Add employee
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSearch}>
          <Label>
            <span className="text-slate-200">Search by department</span>
            <Input
              name="department"
              value={search.department}
              onChange={(e) => setSearch((prev) => ({ ...prev, department: e.target.value }))}
              placeholder="Engineering"
            />
          </Label>
          <Label>
            <span className="text-slate-200">Search by position</span>
            <Input
              name="position"
              value={search.position}
              onChange={(e) => setSearch((prev) => ({ ...prev, position: e.target.value }))}
              placeholder="Developer"
            />
          </Label>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" variant="primary">Search</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={async () => {
                setSearch({ department: '', position: '' });
                const data = await listEmployees();
                setEmployees(data);
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        <Card className="overflow-hidden border-white/10 bg-slate-900/60 shadow-inner shadow-slate-900/30">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2">Photo</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Position</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id} className="border-t border-white/5">
                  <td className="px-3 py-2">
                    <img
                      src={emp.profile_image_url || DEFAULT_AVATAR}
                      alt={`${emp.first_name} ${emp.last_name}`}
                      className="h-10 w-10 rounded-full border border-white/10 object-cover bg-white/5"
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-100">{emp.first_name} {emp.last_name}</td>
                  <td className="px-3 py-2 text-slate-200">{emp.email}</td>
                  <td className="px-3 py-2 text-slate-200">{emp.position}</td>
                  <td className="px-3 py-2 text-slate-200">{emp.department}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                      onClick={() => { setSelected(emp); setIsDetailOpen(true); }}
                    >
                      View
                    </button>
                    <button
                      className="rounded-lg bg-sky-500/80 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-sky-400"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-rose-500/80 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-rose-400"
                      onClick={() => handleDelete(emp.employee_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-slate-300" colSpan={6}>No employees found.</td>
                </tr>
              )}
              </tbody>
            </table>
        </Card>
      </section>

      <Dialog open={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelected(null); }}>
        <DialogHeader>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Employee</p>
            <h3 className="text-lg font-bold text-white">{selected?.first_name} {selected?.last_name}</h3>
         </div>
          <Button variant="ghost" onClick={() => { setIsDetailOpen(false); setSelected(null); }}>
            Close
          </Button>
        </DialogHeader>
        <DialogContent>
          {selected && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2 flex justify-center">
                <img
                  src={selected.profile_image_url || DEFAULT_AVATAR}
                  alt={`${selected.first_name} ${selected.last_name}`}
                  className="h-32 w-32 rounded-full border border-white/10 object-cover bg-white/5"
                />
              </div>
              <Detail label="Email" value={selected.email} />
              <Detail label="Position" value={selected.position} />
              <Detail label="Department" value={selected.department} />
              <Detail label="Salary" value={`$${selected.salary}`} />
              <Detail label="Date of joining" value={selected.date_of_joining?.slice(0, 10)} />
              <Detail label="ID" value={selected.employee_id} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onClose={() => { setIsDialogOpen(false); setEditingId(''); setForm(emptyEmployee); }}>
        <DialogHeader>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"> {editingId ? 'Edit employee' : 'Add employee'}</p>
          </div>
          <Button variant="ghost" onClick={() => { setIsDialogOpen(false); setEditingId(''); setForm(emptyEmployee); }}>
            Close
          </Button>
        </DialogHeader>
        <DialogContent>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledInput label="First name" name="first_name" value={form.first_name} onChange={handleChange} required />
              <LabeledInput label="Last name" name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
            <LabeledInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledInput label="Position" name="position" value={form.position} onChange={handleChange} required />
              <LabeledInput label="Department" name="department" value={form.department} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledInput label="Salary" name="salary" type="number" value={form.salary} onChange={handleChange} required />
              <Label className="gap-1">
                <span>Date of joining</span>
                <Popover
                  trigger={({ open }) => (
                    <Input
                      readOnly
                      value={form.date_of_joining}
                      placeholder="Select a date"
                      className="cursor-pointer"
                    />
                  )}
                  placement="top"
                >
                  {({ close }) => (
                    <Calendar
                      value={form.date_of_joining}
                      onChange={(iso) => {
                        setForm((prev) => ({ ...prev, date_of_joining: iso }));
                        close();
                      }}
                    />
                  )}
                </Popover>
              </Label>
            </div>
            <Label>
              <span>Profile photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="text-sm text-slate-100"
              />
            </Label>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setIsDialogOpen(false); setEditingId(''); setForm(emptyEmployee); }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {editingId ? 'Update employee' : 'Add employee'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <Label className="gap-1">
      <span>{label}</span>
      <Input {...props} />
    </Label>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-300">{label}</p>
      <p className="text-sm text-white break-words">{value || '-'}</p>
    </div>
  );
}

export default EmployeesPage;
