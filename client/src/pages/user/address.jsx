import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, deleteAddress, fetchAddresses, setDefault, updateAddress } from '@/store/user-slice/account-slice'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MESSAGES from '../../constants/messages';


const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required')
    .regex(/^\d+$/, 'ZIP code must contain only numbers'),
  country: z.string().min(1, 'Country is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Address type is required'),
  mobile: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Mobile number must be 10 digits')
})

export default function ShippingAddress() {
  const dispatch = useDispatch()
  const { addresses, loading } = useSelector(state => state.account)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      name: '',
      type: '',
      mobile: ''
    },
    mode: 'onChange' // Enable real-time validation
  })

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault)
      setSelectedAddress(defaultAddress?._id || addresses[0]._id)
    }
  }, [addresses])

  useEffect(() => {
    if (isEditing) {
      const editingAddress = addresses.find(addr => addr._id === isEditing)
      if (editingAddress) {
        reset({
          street: editingAddress.street,
          city: editingAddress.city,
          state: editingAddress.state,
          zip: editingAddress.zip,
          country: editingAddress.country,
          name: editingAddress.name,
          type: editingAddress.type,
          mobile: editingAddress.mobile
        })
      }
    } else {
      reset({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        name: '',
        type: '',
        mobile: ''
      })
    }
  }, [isEditing, addresses, reset])

  const onSubmit = (data) => {
    const addressData = {
      ...data,
      isDefault: true
    }

    if (isEditing) {
      dispatch(updateAddress({ id: isEditing, data: addressData }))
        .unwrap()
        .then(() => {
          setIsEditing(null)
          setShowForm(false)
          toast({
            title: MESSAGES.ADDRESS_UPDATED_SUCCESSFULLY,
          })
        })
    } else {
      dispatch(addAddress(addressData))
        .unwrap()
        .then(() => {
          setShowForm(false)
          toast({
            title: MESSAGES.ADDRESS_ADDED_SUCCESSFULLY,
          })
        })
    }
  }

  const handleEdit = (address) => {
    setIsEditing(address._id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    dispatch(deleteAddress(id)).then(() => {
      toast({
        title: MESSAGES.ADDRESS_DELETED_SUCCESSFULLY,
      })
    })
  }

  if (loading) {
    return <div className="w-full p-5 text-center">Loading addresses...</div>
  }

  return (
    <div className="w-full space-y-6 px-3 mt-4 lg:mt-0 lg:px-0">
      <Card className="px-0 lg:px-4 !shadow-none !border-none">
        {!showForm && (
        <CardHeader className="px-0 flex-row justify-between items-center">
            <Button 
              variant="default" 
              size="icon" 
              className="text-white hover:text-primary-foreground w-[150px]"
              onClick={() => {
                setShowForm(true)
                setIsEditing(null)
              }}
            >
              <Plus className="h-5 w-5 text-white" />
              Add Address
            </Button>
       
        </CardHeader>
        )}
        <CardContent className="px-0">
          {showForm ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-[600px] mt-6">
              <div>
                <Label className="text-gray-600">Street Address</Label>
                <Input 
                  {...register('street')}
                  className={`mt-1 ${errors.street ? 'border-red-500' : ''}`}
                />
                {errors.street && (
                  <p className="text-sm text-red-500 mt-1">{errors.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">City</Label>
                  <Input 
                    {...register('city')}
                    className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-600">State</Label>
                  <Input 
                    {...register('state')}
                    className={`mt-1 ${errors.state ? 'border-red-500' : ''}`}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Zip Code</Label>
                  <Input 
                    {...register('zip')}
                    className={`mt-1 ${errors.zip ? 'border-red-500' : ''}`}
                  />
                  {errors.zip && (
                    <p className="text-sm text-red-500 mt-1">{errors.zip.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-600">Country</Label>
                  <Input 
                    {...register('country')}
                    className={`mt-1 ${errors.country ? 'border-red-500' : ''}`}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Name</Label>
                <Input 
                  {...register('name')}
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Type</Label>
                  <Input 
                    {...register('type')}
                    className={`mt-1 ${errors.type ? 'border-red-500' : ''}`}
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-600">Mobile</Label>
                  <Input 
                    {...register('mobile')}
                    className={`mt-1 ${errors.mobile ? 'border-red-500' : ''}`}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-green-700"
                  disabled={Object.keys(errors).length > 0}
                >
                  {isEditing ? 'Update Address' : 'Add Address'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setIsEditing(null)
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <RadioGroup 
              value={selectedAddress}
              onValueChange={(value) => {
                setSelectedAddress(value)
                dispatch(setDefault(value)).then(() => {
                  toast({
                    title: MESSAGES.DEFAULT_ADDRESS_UPDATED_SUCCESSFULLY,
                  })
                })
              }} 
              className="space-y-4"
            >
              {addresses.map((address) => (
                <Card key={address._id} className="bg-gray-50 border-0 max-w-[600px]">
                  <CardContent className="flex items-center justify-between p-3 lg:py-0">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem 
                        value={address._id} 
                        id={address._id} 
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          <span className="px-2 py-0.5 text-xs bg-primary text-white rounded">
                            {address.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(address)}
                      >
                        <Pencil className="h-5 w-5 !font-bold" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(address._id)}
                      >
                        <Trash className="h-5 w-5 text-red-500 !font-bold" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}