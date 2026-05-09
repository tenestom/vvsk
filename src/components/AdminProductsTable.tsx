"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products"

type Product = {
  id: string
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  price: number
  active: boolean
}

interface AdminProductsTableProps {
  initialProducts: Product[]
}

export function AdminProductsTable({ initialProducts }: AdminProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state for new/edit product
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    price: "",
    active: true,
  })

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      title: product.title,
      description: product.description || "",
      start_date: product.start_date || "",
      end_date: product.end_date || "",
      price: product.price.toString(),
      active: product.active,
    })
  }

  const handleSave = async (id: string) => {
    const result = await updateProduct(id, {
      title: formData.title,
      description: formData.description || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      price: parseInt(formData.price),
      active: formData.active,
    })
    
    if (result.success) {
      setProducts(products.map(p => p.id === id ? { 
        ...p, 
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        price: parseInt(formData.price),
        active: formData.active
      } : p))
      setEditingId(null)
    }
  }

  const handleCreate = async () => {
    const result = await createProduct({
      title: formData.title,
      description: formData.description || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      price: parseInt(formData.price),
      active: formData.active,
    })
    
    if (result.success && result.data) {
      setProducts([result.data as Product, ...products])
      setIsAdding(false)
      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        price: "",
        active: true,
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Är du säker på att du vill avaktivera denna produkt?")) {
      const result = await deleteProduct(id)
      if (result.success) {
        setProducts(products.map(p => p.id === id ? { ...p, active: false } : p))
      }
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Produkter / Tillfällen</h2>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Lägg till produkt
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Titel</th>
              <th className="px-6 py-4 font-medium">Datum</th>
              <th className="px-6 py-4 font-medium text-right">Pris</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className="px-6 py-4">
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titel"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Input 
                      type="date" 
                      value={formData.start_date} 
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                    <Input 
                      type="date" 
                      value={formData.end_date} 
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Pris"
                    className="text-right"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-green-600 font-medium">Aktiv</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="ghost" onClick={handleCreate} className="text-green-600">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {editingId === product.id ? (
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  ) : (
                    product.title
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === product.id ? (
                    <div className="flex gap-2">
                      <Input 
                        type="date" 
                        value={formData.start_date} 
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                      <Input 
                        type="date" 
                        value={formData.end_date} 
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  ) : (
                    product.start_date ? `${product.start_date} till ${product.end_date}` : "Inget datum"
                  )}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {editingId === product.id ? (
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="text-right"
                    />
                  ) : (
                    `${product.price} kr`
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={product.active ? "text-green-600 font-medium" : "text-slate-400"}>
                    {product.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {editingId === product.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleSave(product.id)} className="text-green-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-slate-400">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(product)} className="text-slate-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)} className="text-red-600" title="Avaktivera">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
