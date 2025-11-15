"use client";

import { useState } from "react";
import { TAbiItem } from "@entities/contract";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FlexVertical, Row, Col2 } from "@shared/ui/Grid";
import { useAbiBuilder } from "../model";
import { AbiItemForm } from "./AbiItemForm";
import { HexGenerator } from "./HexGenerator";
import { Plus, Trash2, Download, Upload, X, Edit } from "lucide-react";
import { getAbiItemSignature } from "@entities/contract/lib";

const getAbiItemTypeLabel = (item: TAbiItem): string => {
  if (item.type === "function") return "Function";
  if (item.type === "event") return "Event";
  if (item.type === "constructor") return "Constructor";
  return item.type;
};

const getAbiItemDisplayName = (item: TAbiItem): string => {
  if (item.type === "function" || item.type === "event") {
    return item.name || "(unnamed)";
  }
  return "constructor";
};

export const AbiBuilderPage = () => {
  const {
    abiItems,
    addAbiItem,
    removeAbiItem,
    updateAbiItem,
    clearAll,
    exportAbi,
    importAbi,
  } = useAbiBuilder();

  const [activeTab, setActiveTab] = useState<
    "function" | "event" | "constructor"
  >("function");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const handleAddItem = (item: TAbiItem) => {
    if (editingIndex !== null) {
      updateAbiItem(editingIndex, item);
      setEditingIndex(null);
    } else {
      addAbiItem(item);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleImport = () => {
    try {
      importAbi(importText);
      setImportText("");
      setShowImport(false);
    } catch (error) {
      alert("Invalid ABI JSON");
    }
  };

  const handleExport = () => {
    const abiJson = exportAbi();
    const blob = new Blob([abiJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abi.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const abiJson = exportAbi();
    navigator.clipboard.writeText(abiJson);
  };

  return (
    <FlexVertical size="large">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">ABI Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build your contract ABI manually by adding functions, events, and
            constructors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={abiItems.length === 0}
          >
            Copy
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={abiItems.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="destructive"
            onClick={clearAll}
            disabled={abiItems.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      {showImport && (
        <Card>
          <CardHeader>
            <CardTitle>Import ABI</CardTitle>
            <CardDescription>Paste your ABI JSON to import</CardDescription>
          </CardHeader>
          <CardContent>
            <FlexVertical size="medium">
              <Textarea
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='[{"type":"function","name":"myFunction",...}]'
              />
              <div className="flex gap-2">
                <Button onClick={handleImport} disabled={!importText.trim()}>
                  Import
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImport(false);
                    setImportText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </FlexVertical>
          </CardContent>
        </Card>
      )}

      <Row>
        <Col2>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="function">Add Function</TabsTrigger>
              <TabsTrigger value="event">Add Event</TabsTrigger>
              <TabsTrigger value="constructor">Add Constructor</TabsTrigger>
            </TabsList>
            <TabsContent value="function" className="mt-4">
              <AbiItemForm
                key={`function-${
                  editingIndex !== null ? `edit-${editingIndex}` : "new"
                }`}
                type="function"
                onSubmit={handleAddItem}
                onCancel={editingIndex !== null ? handleCancelEdit : undefined}
                initialItem={
                  editingIndex !== null &&
                  abiItems[editingIndex]?.type === "function"
                    ? abiItems[editingIndex]
                    : undefined
                }
              />
            </TabsContent>
            <TabsContent value="event" className="mt-4">
              <AbiItemForm
                key={`event-${
                  editingIndex !== null ? `edit-${editingIndex}` : "new"
                }`}
                type="event"
                onSubmit={handleAddItem}
                onCancel={editingIndex !== null ? handleCancelEdit : undefined}
                initialItem={
                  editingIndex !== null &&
                  abiItems[editingIndex]?.type === "event"
                    ? abiItems[editingIndex]
                    : undefined
                }
              />
            </TabsContent>
            <TabsContent value="constructor" className="mt-4">
              <AbiItemForm
                key={`constructor-${
                  editingIndex !== null ? `edit-${editingIndex}` : "new"
                }`}
                type="constructor"
                onSubmit={handleAddItem}
                onCancel={editingIndex !== null ? handleCancelEdit : undefined}
                initialItem={
                  editingIndex !== null &&
                  abiItems[editingIndex]?.type === "constructor"
                    ? abiItems[editingIndex]
                    : undefined
                }
              />
            </TabsContent>
          </Tabs>
        </Col2>
        <Col2>
          <Card>
            <CardHeader>
              <CardTitle>ABI Items ({abiItems.length})</CardTitle>
              <CardDescription>
                Preview and manage your ABI items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <FlexVertical size="small">
                  {abiItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No ABI items yet. Add functions, events, or constructors
                      to get started.
                    </p>
                  ) : (
                    abiItems.map((item, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {getAbiItemTypeLabel(item)}
                                </Badge>
                                <span className="font-medium truncate">
                                  {getAbiItemDisplayName(item)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-mono break-all">
                                {getAbiItemSignature(item)}
                              </p>
                              {(item.type === "function" ||
                                item.type === "event" ||
                                item.type === "constructor") && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  {item.inputs.length} input
                                  {item.inputs.length !== 1 ? "s" : ""}
                                  {item.type === "function" && item.outputs && (
                                    <>
                                      {" "}
                                      • {item.outputs.length} output
                                      {item.outputs.length !== 1 ? "s" : ""}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingIndex(index);
                                  if (item.type === "function")
                                    setActiveTab("function");
                                  else if (item.type === "event")
                                    setActiveTab("event");
                                  else setActiveTab("constructor");
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAbiItem(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </FlexVertical>
              </div>
            </CardContent>
          </Card>
        </Col2>
      </Row>

      <HexGenerator abiItems={abiItems} />

      {abiItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated ABI JSON</CardTitle>
            <CardDescription>Your complete ABI ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={15}
              value={exportAbi()}
              readOnly
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </FlexVertical>
  );
};
