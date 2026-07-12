'use client';

import React, { useState } from 'react';
import { useESG, EmissionFactor } from '../../../context/ESGContext';
import { 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  Leaf, 
  X, 
  AlertTriangle,
  Flame,
  Zap,
  Truck,
  ShoppingBag
} from 'lucide-react';

export default function EmissionFactorsConfig() {
  const { 
    emissionFactors, 
    addEmissionFactor, 
    updateEmissionFactor, 
    deleteEmissionFactor 
  } = useESG();

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingFactor, setEditingFactor] = useState<EmissionFactor | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet'>('Manufacturing');
  const [co2Rate, setCo2Rate] = useState(0);
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAddModal = () => {
    setEditingFactor(null);
    setName('');
    setCategory('Manufacturing');
    setCo2Rate(0.1);
    setUnit('');
    setStatus('Active');
    setShowModal(true);
  };

  const openEditModal = (factor: EmissionFactor) => {
    setEditingFactor(factor);
    setName(factor.name);
    setCategory(factor.category);
    setCo2Rate(factor.co2Rate);
    setUnit(factor.unit);
    setStatus(factor.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim() || co2Rate <= 0) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    if (editingFactor) {
      updateEmissionFactor(editingFactor.id, {
        name,
        category,
        co2Rate: parseFloat(co2Rate.toFixed(4)),
        unit,
        status
      });
    } else {
      addEmissionFactor({
        name,
        category,
        co2Rate: parseFloat(co2Rate.toFixed(4)),
        unit,
        status
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, factorName: string) => {
    if (confirm(`Are you sure you want to delete the emission factor "${factorName}"? Active carbon transactions using this factor will remain unchanged, but new transactions cannot use it.`)) {
      deleteEmissionFactor(id);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Manufacturing':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Fleet':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Expense':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Purchase':
        return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      default:
        return <Database className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Emission Factors Configuration
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Configure CO₂ equivalent emission rates per operational unit to automate ESG accounting calculations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Emission Factor</span>
        </button>
      </div>

      {/* Grid of Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {emissionFactors.map((factor) => (
          <div 
            key={factor.id} 
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-border transition relative group"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-card border border-border rounded-xl">
                  {getCategoryIcon(factor.category)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm tracking-wide">{factor.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5 block">{factor.category}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full border ${
                factor.status === 'Active' 
                  ? 'text-primary bg-primary/10 border-primary/20' 
                  : 'text-muted-foreground bg-card border-border'
              }`}>
                {factor.status}
              </span>
            </div>

            {/* Calculations Card */}
            <div className="bg-background border border-border rounded-xl p-3 flex items-center justify-between font-mono">
              <span className="text-[10px] text-muted-foreground">FACTOR RATE:</span>
              <div className="text-right">
                <p className="text-sm font-extrabold text-primary">{factor.co2Rate} kg CO₂</p>
                <p className="text-[9px] text-muted-foreground">per {factor.unit}</p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => openEditModal(factor)}
                className="p-2 text-muted-foreground hover:text-primary bg-card hover:bg-card border border-border rounded-lg text-xs transition cursor-pointer"
                title="Edit Factor"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(factor.id, factor.name)}
                className="p-2 text-muted-foreground hover:text-red-400 bg-card hover:bg-card border border-border rounded-lg text-xs transition cursor-pointer"
                title="Delete Factor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                {editingFactor ? 'Edit Emission Factor' : 'Add New Emission Factor'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Factor Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Factor Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Solar Energy Offset"
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Fleet">Fleet</option>
                    <option value="Expense">Expense</option>
                    <option value="Purchase">Purchase</option>
                  </select>
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Operational Unit</label>
                  <input 
                    type="text" 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                    placeholder="e.g. kWh, Liters, km"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CO2 Rate */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">CO₂ Rate (kg CO₂ / Unit)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={co2Rate || ''} 
                    onChange={(e) => setCo2Rate(parseFloat(e.target.value) || 0)} 
                    placeholder="0.38"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-primary/5 border border-primary/10 text-[10px] text-muted-foreground rounded-lg leading-relaxed flex gap-2">
                <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Adding or changing factors will directly scale future emission calculations on carbon transactions linked to this factor.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  {editingFactor ? 'Save Changes' : 'Configure Factor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
