'use client'

import { Button } from '@liam-hq/ui'
import { useState } from 'react'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'

interface DeleteOrganizationButtonProps {
  organizationId: string
  organizationName: string
  handleDeleteOrganization: (formData: FormData) => Promise<void>
}

export function DeleteOrganizationButton({
  organizationId,
  organizationName,
  handleDeleteOrganization,
}: DeleteOrganizationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleOpenModal = () => {
    setIsModalOpen(true)
    // Reset confirmation text when opening the modal
    setConfirmText('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmTextChange = (text: string) => {
    setConfirmText(text)
  }

  const handleConfirmDelete = async () => {
    // Check if confirmation text matches organization name
    if (confirmText === organizationName) {
      // Create FormData object directly
      const formData = new FormData()
      formData.append('organizationId', organizationId)
      formData.append('confirmText', organizationName)

      // Call server action directly with the form data
      await handleDeleteOrganization(formData)
    }
  }

  return (
    <>
      <Button variant="solid-danger" onClick={handleOpenModal}>
        Delete
      </Button>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        organizationName={organizationName}
        confirmText={confirmText}
        onConfirmTextChange={handleConfirmTextChange}
        isConfirmEnabled={confirmText === organizationName}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
