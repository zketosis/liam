// https://nextjs.org/docs/app/api-reference/file-conventions/page
export type PageProps = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}
