
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal, Trash, Upload } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GalleryImageForm } from '@/components/forms/gallery-image-form';

export default function AdminGalleryPage() {
    const firestore = useFirestore();
    const galleryQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'gallery'), orderBy('order', 'asc'));
    }, [firestore]);

    const { data: images, loading, error } = useCollection<GalleryImage>(galleryQuery);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const { toast } = useToast();

    const handleFormSuccess = async (data: Omit<GalleryImage, 'id'>) => {
        if (!firestore) return;
        
        try {
            if (selectedImage) {
                await updateDoc(doc(firestore, 'gallery', selectedImage.id), data);
                toast({ title: 'Image Updated!', description: `The image details have been saved.` });
            } else {
                await addDoc(collection(firestore, 'gallery'), data);
                toast({ title: 'Image Added!', description: `The new image has been added to the gallery.` });
            }
            setIsFormOpen(false);
            setSelectedImage(null);
        } catch (e: any) {
            console.error("Error saving document: ", e);
            toast({ variant: 'destructive', title: 'Error Saving Image', description: e.message });
        }
    };

    const handleDeleteImage = async (imageId: string, altText: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'gallery', imageId));
            toast({ title: 'Image Deleted', description: `The image '${altText}' has been removed.` });
        } catch (e: any) {
            console.error("Error deleting document: ", e);
            toast({ variant: 'destructive', title: 'Error Deleting Image', description: e.message });
        }
    };

    const handleEditClick = (image: GalleryImage) => {
        setSelectedImage(image);
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setSelectedImage(null);
        setIsFormOpen(true);
    };

    return (
        <>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Homepage Gallery</CardTitle>
                            <CardDescription>Manage the images displayed in the gallery on the homepage.</CardDescription>
                        </div>
                        <Button size="sm" className="gap-1" onClick={handleAddClick}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Image
                            </span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
                        </div>
                    ) : images && images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map(image => (
                                <div key={image.id} className="relative group aspect-square">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.altText}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleEditClick(image)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete the image from the gallery.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteImage(image.id, image.altText)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-md">
                                        <p className="text-white text-xs truncate">{image.altText}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border rounded-lg">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No gallery images found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Add an image to get started.</p>
                        </div>
                    )}
                    {error && <p className="text-destructive text-center p-4">Error: {error.message}</p>}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
                if (!isOpen) setSelectedImage(null);
                setIsFormOpen(isOpen);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{selectedImage ? 'Edit' : 'Add'} Gallery Image</DialogTitle>
                        <DialogDescription>
                            {selectedImage ? 'Update the details for this image.' : 'Upload a new image for the homepage gallery.'}
                        </DialogDescription>
                    </DialogHeader>
                    <GalleryImageForm
                        key={selectedImage?.id || 'new'}
                        image={selectedImage}
                        onSuccess={handleFormSuccess}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
