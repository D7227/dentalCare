import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Package, Search, Plus, Minus, X, Pencil, Wrench } from "lucide-react";
import BaseModal from "@/components/shared/BaseModal";
import { cn } from "@/lib/utils";

interface AccessorySelectionProps {
  formData: any;
  setFormData: (data: any) => void;
  editMode?: boolean;
  readMode?: boolean;
}

interface SelectedAccessory {
  name: string;
  quantity: number;
}

const AccessorySelection = ({
  formData,
  setFormData,
  editMode = false,
  readMode = false,
}: AccessorySelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editModel, setEditModel] = useState<boolean>(false);
  const [modalAccessories, setModalAccessories] = useState<SelectedAccessory[]>(
    []
  );

  // Sample accessories for the searchbar
  const availableAccessories = [
    { id: "impression-tray", name: "Impression Tray" },
    { id: "bite-registration", name: "Bite Registration" },
    { id: "shade-guide", name: "Shade Guide" },
    { id: "articulator", name: "Articulator" },
    { id: "face-bow", name: "Face Bow" },
    { id: "wax-rim", name: "Wax Rim" },
    { id: "temporary-crown", name: "Temporary Crown" },
    { id: "healing-cap", name: "Healing Cap" },
    { id: "abutment", name: "Abutment" },
    { id: "impression-post", name: "Impression Post" },
    { id: "transfer-coping", name: "Transfer Coping" },
    { id: "analog", name: "Analog" },
  ];

  const accessorios: SelectedAccessory[] = formData.accessorios || [];

  const filteredAccessories = useMemo(() => {
    return availableAccessories.filter(
      (accessory) =>
        accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !accessorios.some((selected) => selected.name === accessory.name)
    );
  }, [searchQuery, accessorios]);

  const addAccessory = (accessory: { id: string; name: string }) => {
    const newAccessory: SelectedAccessory = {
      name: accessory.name,
      quantity: 1,
    };

    setFormData({
      ...formData,
      accessorios: [...accessorios, newAccessory],
    });
    setSearchQuery("");
  };

  const removeAccessory = (accessoryName: string) => {
    setFormData({
      ...formData,
      accessorios: accessorios.filter(
        (acc) => acc.name !== accessoryName
      ),
    });
  };

  const updateQuantity = (accessoryName: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setFormData({
      ...formData,
      accessorios: accessorios.map((acc) =>
        acc.name === accessoryName ? { ...acc, quantity: newQuantity } : acc
      ),
    });
  };

  const getTotalAccessories = () => {
    return accessorios.reduce((total, acc) => total + acc.quantity, 0);
  };

  const renderSearchBar = () => {
    return (
      <div className="space-y-2">
        <Label htmlFor="accessory-search">Search Accessories</Label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            id="accessory-search"
            placeholder="Type to search accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchQuery && filteredAccessories.length > 0 && (
          <div className="border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
            {filteredAccessories.map((accessory) => (
              <button
                key={accessory.id}
                onClick={() => addAccessory(accessory)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              >
                <span className="text-sm font-medium">{accessory.name}</span>
              </button>
            ))}
          </div>
        )}

        {searchQuery && filteredAccessories.length === 0 && (
          <div className="text-sm text-gray-500 p-3 text-center border rounded-lg bg-gray-50">
            No accessories found matching "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  const selectedAccessoriesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Selected Accessories</Label>
          <Badge variant="secondary" className="text-xs">
            {getTotalAccessories()} item
            {getTotalAccessories() !== 1 ? "s" : ""} total
          </Badge>
        </div>

        <div className="space-y-3">
          {accessorios.map((accessory) => (
            <div
              key={accessory.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1">
                <span className="font-medium text-sm">{accessory.name}</span>
              </div>

              {!readMode && !editMode ? (
                <div className="flex items-center gap-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(accessory.name, accessory.quantity - 1)
                      }
                      disabled={accessory.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus size={14} />
                    </Button>

                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {accessory.quantity}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(accessory.name, accessory.quantity + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAccessory(accessory.name)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <span className="min-w-[2rem] text-center text-sm font-medium">
                  {accessory.quantity} item
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const noSelectedAccessories = () => {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Package className="mx-auto mb-3 text-gray-400" size={32} />
        <p className="text-sm text-gray-500 font-medium mb-1">
          No accessories selected
        </p>
        <p className="text-xs text-gray-400">
          Use the search bar above to add accessories to this case
        </p>
      </div>
    );
  };

  // When opening the modal, sync modalAccessories with current accessorios
  useEffect(() => {
    if (editModel) {
      setModalAccessories([...accessorios]);
    }
  }, [editModel]);

  // Modal Save handler
  const handleSaveAccessories = () => {
    setFormData({
      ...formData,
      selectedAccessories: modalAccessories,
    });
    setEditModel(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          {!readMode ? (
            <>
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Package size={20} />
                Accessories Selection
              </CardTitle>
              <p className="text-xs sm:text-base">
                Search and add accessories needed for this case
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2 justify-between">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <div
                  className={cn(
                    "p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]",
                    readMode || editMode ? "flex" : "hidden"
                  )}
                >
                  <Wrench className="h-4 w-4" />
                </div>
                Accessories
              </CardTitle>
              {editMode && (
                <button
                  type="button"
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                  onClick={() => setEditModel(true)}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          {!readMode && !editModel && <div>{renderSearchBar()}</div>}
          {/* Selected Accessories */}
          {accessorios.length > 0
            ? selectedAccessoriesList()
            : noSelectedAccessories()}

          {/* Impression Handling - Show only when accessories are selected */}
          {accessorios.length > 0 && (
            <div className="border-t pt-6">
              <div className="space-y-4">
                {
                  readMode && (
                        <Label className="text-base font-medium">
                        {formData.orderType === "pickup-from-lab" ? "Pickup from Clinic" : "Send by Courier"}
                        </Label>
                  )
                }
                {!readMode && (
                  <>
                  <Label className="text-base font-medium">Handling Type</Label>
                  <RadioGroup
                    value={formData.orderType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        orderType: value,
                      })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="pickup-from-lab"
                        id="pickup-from-lab"
                      />
                      <Label htmlFor="pickup-from-lab" className="cursor-pointer">
                        Pickup from Clinic
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="send-by-courier"
                        id="send-by-courier"
                      />
                      <Label htmlFor="send-by-courier" className="cursor-pointer">
                        Send by Courier
                      </Label>
                    </div>
                  </RadioGroup>
                  </>
                )}

                {/* Pickup Details */}
                {formData.orderType === "pickup-from-lab" && !readMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Label
                        htmlFor="pickupDate"
                        className="text-sm font-medium"
                      >
                        Pickup Date
                      </Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData?.pickupData?.pickupDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickupData: {
                              ...formData?.pickupData,
                              pickupDate: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="pickupTime"
                        className="text-sm font-medium"
                      >
                        Pickup Time
                      </Label>
                      <Input
                        id="pickupTime"
                        type="time"
                        value={formData?.pickupData?.pickupTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickupData: {
                              ...formData?.pickupData,
                              pickupTime: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="pickupRemarks"
                        className="text-sm font-medium"
                      >
                        Pickup Remarks
                      </Label>
                      <Textarea
                        id="pickupRemarks"
                        value={formData?.pickupData?.pickupRemarks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickupData: {
                              ...formData?.pickupData,
                              pickupRemarks: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                        rows={3}
                        placeholder="Any special instructions for pickup..."
                      />
                    </div>
                  </div>
                )}

                {/* Pickup Details - Read Only */}
                {formData.orderType === "pickup-from-lab" && readMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Pickup Date
                      </Label>
                      <div className="mt-1 p-2 bg-white border rounded text-sm">
                        {formData?.pickupData?.pickupDate || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Pickup Time
                      </Label>
                      <div className="mt-1 p-2 bg-white border rounded text-sm">
                        {formData?.pickupData?.pickupTime || "Not specified"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Pickup Remarks
                      </Label>
                      <div className="mt-1 p-2 bg-white border rounded text-sm min-h-[60px]">
                        {formData?.pickupData?.pickupRemarks || "No remarks"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Courier Details */}
                {formData.orderType === "send-by-courier" && !readMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Label
                        htmlFor="courierName"
                        className="text-sm font-medium"
                      >
                        Courier Name
                      </Label>
                      <Input
                        id="courierName"
                        type="text"
                        placeholder="Search courier name..."
                        value={formData.courierData?.courierName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            courierData: {
                              ...formData.courierData,
                              courierName: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="trackingId"
                        className="text-sm font-medium"
                      >
                        Tracking ID
                      </Label>
                      <Input
                        id="trackingId"
                        type="text"
                        placeholder="Enter tracking ID..."
                        value={formData.courierData?.trackingId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            courierData: {
                              ...formData.courierData,
                              trackingId: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Courier Details - Read Only */}
                {formData.orderType === "send-by-courier" && readMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Courier Name
                      </Label>
                      <div className="mt-1 p-2 bg-white border rounded text-sm">
                        {formData.courierData?.courierName || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Tracking ID
                      </Label>
                      <div className="mt-1 p-2 bg-white border rounded text-sm">
                        {formData.courierData?.trackingId || "Not specified"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <BaseModal
        isOpen={editModel}
        onClose={() => setEditModel(false)}
        title="Update the Accessories"
        overflow="visible"
        className={"max-w-[250px] md:max-w-[60%]"}
      >
        <div className="flex flex-col w-full ">
          <div className="flex flex-row md:flex-row w-full  gap-2">
            <div className="w-[50%]">
              {/* Modal search bar for adding accessories */}
              <Label htmlFor="modal-accessory-search">Add Accessory</Label>
              <div className="relative mt-2 mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  id="modal-accessory-search"
                  placeholder="Type to search accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && filteredAccessories.length > 0 && (
                <div className="border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
                  {filteredAccessories.map((accessory) => (
                    <button
                      key={accessory.id}
                      onClick={() => {
                        if (
                          !modalAccessories.some((a) => a.name === accessory.name)
                        ) {
                          setModalAccessories([
                            ...modalAccessories,
                            { name: accessory.name, quantity: 1 },
                          ]);
                        }
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {accessory.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && filteredAccessories.length === 0 && (
                <div className="text-sm text-gray-500 p-3 text-center border rounded-lg bg-gray-50">
                  No accessories found matching "{searchQuery}"
                </div>
              )}
            </div>
            <div className="w-[50%]">
              {/* Modal selected accessories list */}
              <Label className="text-base font-medium">
                Selected Accessories
              </Label>
              {modalAccessories.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {modalAccessories.map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <span className="font-medium text-sm">{a.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModalAccessories(
                              modalAccessories.map((acc) =>
                                acc.name === a.name
                                  ? {
                                      ...acc,
                                      quantity: Math.max(1, a.quantity - 1),
                                    }
                                  : acc
                              )
                            )
                          }
                          disabled={a.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus size={14} />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          value={a.quantity}
                          onChange={(e) =>
                            setModalAccessories(
                              modalAccessories.map((acc) =>
                                acc.name === a.name
                                  ? {
                                      ...acc,
                                      quantity: Math.max(
                                        1,
                                        Number(e.target.value)
                                      ),
                                    }
                                  : acc
                              )
                            )
                          }
                          className="w-14 text-center border rounded px-2 py-1 text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModalAccessories(
                              modalAccessories.map((acc) =>
                                acc.name === a.name
                                  ? { ...acc, quantity: a.quantity + 1 }
                                  : acc
                              )
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setModalAccessories(
                              modalAccessories.filter((acc) => acc.name !== a.name)
                            )
                          }
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-2">
                  <Package className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    No accessories selected
                  </p>
                  <p className="text-xs text-gray-400">
                    Use the search bar to add accessories to this case
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={() => setEditModel(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAccessories}
              className="bg-[#11AB93] hover:bg-[#0F9A82] text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default AccessorySelection;
