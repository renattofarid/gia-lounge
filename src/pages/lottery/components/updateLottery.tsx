// // Este componente es una versión extendida de CreateLotteryForm
// // con soporte completo para editar todos los campos, incluidos los premios.

// "use client";

// import { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format, parseISO } from "date-fns";
// import { Camera } from "lucide-react";

// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { DialogFooter } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import RichTextEditor from "@/components/RichTextEditor";
// import { DateTimePickerInline } from "@/components/DateTimePickerInline";

// import { useComapanyStore } from "@/pages/company/lib/company.store";
// import { useEventStore } from "@/pages/events/lib/event.store";
// import { updateRaffle } from "../lib/lottery.actions";
// import type { Raffle } from "../lib/lottery.interface";

// const PrizeSchema = z.object({
//   name: z.string(),
//   description: z.string(),
//   route: z.any().optional(),
// });

// const EditLotterySchema = z.object({
//   id: z.number(),
//   company_id: z.number(),
//   lottery_name: z.string(),
//   lottery_description: z.string(),
//   lottery_date: z.date(),
//   event_id: z.number(),
//   lottery_price: z.string(),
//   price_factor_consumo: z.string(),
//   number_of_prizes: z.string(),
//   main_image: z.any().optional(),
//   prizes: z.array(PrizeSchema),
// });

// export default function EditLotteryForm({
//   onClose,
//   lottery,
// }: {
//   onClose: () => void;
//   lottery: Raffle;
// }) {
//   const form = useForm<z.infer<typeof EditLotterySchema>>({
//     resolver: zodResolver(EditLotterySchema),
//     defaultValues: {
//       ...lottery,
//       lottery_date:
//         typeof lottery.lottery_date === "string"
//           ? parseISO(lottery.lottery_date)
//           : new Date(lottery.lottery_date),
//       number_of_prizes: String(lottery.prizes?.length || 1),
//       main_image: null,
//     },
//   });

//   const { companies, loadCompanies } = useComapanyStore();
//   const { events } = useEventStore();

//   const { fields, update } = useFieldArray({
//     control: form.control,
//     name: "prizes",
//   });

//   const [mainImagePreview, setMainImagePreview] = useState<string | null>(
//     lottery.main_image_url || null
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     loadCompanies(1);
//   }, []);

//   const selectedCompanyId = form.watch("company_id");
//   const numberOfPrizes = form.watch("number_of_prizes");

//   const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setMainImagePreview(ev.target?.result as string);
//       reader.readAsDataURL(file);
//       form.setValue("main_image", file);
//     }
//   };

//   const handleFormSubmit = async (data: z.infer<typeof EditLotterySchema>) => {
//     const formattedDate = format(data.lottery_date, "yyyy-MM-dd HH:mm");
//     const formData = new FormData();
//     formData.append("id", data.id.toString());
//     formData.append("company_id", data.company_id.toString());
//     formData.append("lottery_name", data.lottery_name);
//     formData.append("lottery_description", data.lottery_description);
//     formData.append("lottery_date", formattedDate);
//     formData.append("event_id", data.event_id.toString());
//     formData.append("lottery_price", data.lottery_price);
//     formData.append("price_factor_consumo", data.price_factor_consumo);
//     formData.append("number_of_prizes", data.number_of_prizes);
//     if (data.main_image) formData.append("main_image", data.main_image);

//     data.prizes.forEach((prize, idx) => {
//       formData.append(`prizes[${idx}][name]`, prize.name);
//       formData.append(`prizes[${idx}][description]`, prize.description);
//       if (prize.route) formData.append(`prizes[${idx}][route]`, prize.route);
//     });

//     setIsSubmitting(true);
//     await updateRaffle(formData);
//     setIsSubmitting(false);
//     onClose();
//   };

//   return (
//     <div className="p-2">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleFormSubmit)}
//           className="space-y-6"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary rounded-lg p-6">
//             <div className="flex flex-col gap-4">
//               <FormField
//                 control={form.control}
//                 name="lottery_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nombre</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="lottery_description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Descripción</FormLabel>
//                     <FormControl>
//                       <RichTextEditor
//                         value={field.value}
//                         onChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="main_image"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel>Imagen principal</FormLabel>
//                     <FormControl>
//                       <label className="h-20 flex items-center justify-center bg-pink-200 border border-dashed cursor-pointer relative">
//                         {mainImagePreview && (
//                           <img
//                             src={mainImagePreview}
//                             className="absolute w-full h-full object-cover opacity-80"
//                           />
//                         )}
//                         <Camera className="h-5 w-5 text-pink-400 z-10" />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleMainImageChange}
//                         />
//                       </label>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="lottery_date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Fecha</FormLabel>
//                     <DateTimePickerInline
//                       value={field.value}
//                       onChange={field.onChange}
//                     />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="lottery_price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Precio</FormLabel>
//                     <FormControl>
//                       <Input {...field} type="number" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="price_factor_consumo"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Factor Consumo</FormLabel>
//                     <FormControl>
//                       <Input {...field} type="number" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="number_of_prizes"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Premios</FormLabel>
//                     <FormControl>
//                       <Input {...field} type="number" min={1} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>

//           <Separator className="my-4" />
//           <div className="h-48 overflow-y-auto hiddenScroll px-2">
//             {fields.map((field, index) => (
//               <div key={field.id} className="flex items-end gap-4 mb-4">
//                 <FormField
//                   control={form.control}
//                   name={`prizes.${index}.name`}
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel>Nombre premio {index + 1}</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name={`prizes.${index}.description`}
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel>Descripción</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name={`prizes.${index}.route`}
//                   render={({ field }) => {
//                     const file = field.value as File | undefined;
//                     const [preview, setPreview] = useState<string | null>(null);

//                     useEffect(() => {
//                       if (file instanceof File) {
//                         const reader = new FileReader();
//                         reader.onload = (e) =>
//                           setPreview(e.target?.result as string);
//                         reader.readAsDataURL(file);
//                       } else {
//                         setPreview(null);
//                       }
//                     }, [file]);

//                     return (
//                       <FormItem className="aspect-square">
//                         <FormLabel>Imagen</FormLabel>
//                         <FormControl>
//                           <label className="h-10 w-10 flex items-center justify-center bg-pink-200 rounded-md border border-dashed cursor-pointer relative">
//                             <Camera className="h-4 w-4 text-pink-400" />
//                             <input
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) field.onChange(file);
//                               }}
//                             />
//                             {preview && (
//                               <img
//                                 src={preview}
//                                 className="absolute w-full h-full object-cover rounded-md opacity-80"
//                               />
//                             )}
//                           </label>
//                         </FormControl>
//                       </FormItem>
//                     );
//                   }}
//                 />
//               </div>
//             ))}
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="secondary" onClick={onClose}>
//               Cancelar
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Actualizar"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </Form>
//     </div>
//   );
// }
