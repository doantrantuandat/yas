import { FieldErrorsImpl, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { CheckBox } from 'common/items/Input';
import { useEffect, useState } from 'react';
import { Input } from 'common/items/Input';
import { Warehouse } from '../models/Warehouse';
import { Country } from '@locationModels/Country';
import { StateOrProvince } from '@locationModels/StateOrProvince';
import { getCountries } from '@locationServices/CountryService';
import { getTaxClasses } from '@taxServices/TaxClassService';
import { getStatesOrProvinces } from '@locationServices/StateOrProvinceService';
import { OptionSelect } from '@commonItems/OptionSelect';
import { District } from '@locationModels/District';
import { useRouter } from 'next/router';
import { getDistricts } from '@locationServices/DistrictService';

type Props = {
  register: UseFormRegister<Warehouse>;
  errors: FieldErrorsImpl<Warehouse>;
  setValue: UseFormSetValue<Warehouse>;
  trigger: UseFormTrigger<Warehouse>;
  warehouse?: Warehouse;
};

const WarehouseGeneralInformation = ({ register, errors, setValue, trigger, warehouse }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const [countries, setCountries] = useState<Country[]>([]);
  const [statesOrProvinces, setStatesOrProvinces] = useState<StateOrProvince[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data);
    });
  }, []);

  useEffect(() => {
    if (warehouse) {
      getStatesOrProvinces(warehouse.countryId).then((data) => {
        setStatesOrProvinces(data);
      });
      getDistricts(warehouse.stateOrProvinceId).then((data) => {
        setDistricts(data);
      });
    }
  }, [id]);

  const onCountryChange = async (event: any) => {
    getStatesOrProvinces(event.target.value).then((data) => {
      setStatesOrProvinces(data);
      getDistricts(event.target.value).then((data) => {
        if (data) {
          setDistricts(data);
        } else {
          setDistricts([]);
        }
      });
    });
  };

  const onStateOrProvinceChange = async (event: any) => {
    getDistricts(event.target.value).then((data) => {
      setDistricts(data);
    });
  };
  if (id && !warehouse) return <p>No warehouse</p>;
    if (id && (countries.length == 0 || statesOrProvinces.length == 0 || districts.length == 0))
      return <></>;
  return (
    <>
      <Input
        labelText="Name"
        field="name"
        defaultValue={warehouse?.name}
        register={register}
        registerOptions={{
          required: { value: true, message: 'Name is required' },
        }}
        error={errors.name?.message}
      />
      <Input
        labelText="Contact Name"
        field="contactName"
        defaultValue={warehouse?.contactName}
        register={register}
        error={errors.contactName?.message}
      />
      <Input
        labelText="Phone"
        field="phone"
        defaultValue={warehouse?.phone}
        register={register}
        error={errors.phone?.message}
      />
      <Input
        labelText="Address Line 1"
        field="addressLine1"
        defaultValue={warehouse?.addressLine1}
        register={register}
        error={errors.addressLine1?.message}
      />
      <Input
        labelText="Address Line 2"
        field="addressLine2"
        defaultValue={warehouse?.addressLine2}
        register={register}
        error={errors.addressLine2?.message}
      />
      <Input
        labelText="City"
        field="city"
        defaultValue={warehouse?.city}
        register={register}
        error={errors.city?.message}
      />
      <OptionSelect
                      labelText="Country"
                      field="countryId"
                      placeholder="Select country"
                      options={countries}
                      register={register}
                      registerOptions={{
                        required: { value: true, message: 'Please select country' },
                        onChange: onCountryChange,
                      }}
                      error={errors.countryId?.message}
                      defaultValue={warehouse?.countryId}
                    />



      <OptionSelect
        labelText="State or province"
        field="stateOrProvinceId"
        placeholder="Select state or province"
        options={statesOrProvinces}
        register={register}
        registerOptions={{
                               required: { value: true, message: 'Please select state or ' },
                               onChange: onStateOrProvinceChange,
                             }}
        error={errors.stateOrProvinceId?.message}
        defaultValue={warehouse?.stateOrProvinceId}
      />

       <OptionSelect
                     labelText="District"
                     register={register}
                     field="districtId"
                     options={districts}
                     placeholder="Select district"
                     registerOptions={{
                       required: { value: true, message: 'Please select district' },
                     }}
                      defaultValue={warehouse?.districtId}
                   />

      <Input
        labelText="Postal Code"
        field="zipCode"
        defaultValue={warehouse?.zipCode}
        register={register}
        error={errors.zipCode?.message}
      />
    </>
  );
};

export default WarehouseGeneralInformation;
