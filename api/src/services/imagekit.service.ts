import ImageKit from "imagekit";

/**
 * ImageKit SDK service for uploading, managing, and deleting product assets.
 */

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;

export const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
});

export interface UploadImageResult {
    url: string;
    fileId: string;
    name: string;
    thumbnailUrl?: string;
}

/**
 * Upload an image (Buffer, base64 string, or remote URL) to ImageKit.
 *
 * @param file Buffer or base64 string of the file to upload
 * @param fileName Original or preferred filename (e.g. "panadol-500.png")
 * @param folder ImageKit target folder path (default: "/products")
 */
export async function uploadProductImage(
    file: Buffer | string,
    fileName: string,
    folder: string = "/products"
): Promise<UploadImageResult> {
    if (!privateKey || !publicKey || !urlEndpoint) {
        throw new Error(
            "ImageKit configuration missing. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in your .env file."
        );
    }

    // Sanitize filename
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const response = await imagekit.upload({
        file,
        fileName: cleanFileName,
        folder,
        useUniqueFileName: true,
    });

    return {
        url: response.url,
        fileId: response.fileId,
        name: response.name,
        thumbnailUrl: response.thumbnailUrl,
    };
}

/**
 * Delete an image by its unique ImageKit fileId.
 */
export async function deleteProductImage(fileId: string): Promise<boolean> {
    if (!privateKey || !publicKey || !urlEndpoint) {
        throw new Error("ImageKit configuration missing.");
    }

    await imagekit.deleteFile(fileId);
    return true;
}

/**
 * Generate client-side authentication parameters if direct client upload is ever needed.
 */
export function getAuthenticationParameters() {
    return imagekit.getAuthenticationParameters();
}

export default {
    uploadProductImage,
    deleteProductImage,
    getAuthenticationParameters,
    client: imagekit,
};
