'use client'

import React, { ReactNode, useState } from 'react'
import { updateKnowledgeSuggestionContent } from '../../actions/updateKnowledgeSuggestionContent'
import styles from './EditableContent.module.css'

type EditableContentProps = {
  content: string
  suggestionId: number
  className?: string
  children: (isEditing: boolean, content: string) => ReactNode
}

export const useEditableContent = (initialContent: string) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [savedContent, setSavedContent] = useState(initialContent)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setEditedContent(savedContent)
    setIsEditing(false)
  }

  const handleSave = async (formData: FormData) => {
    try {
      setIsSaving(true)
      await updateKnowledgeSuggestionContent(formData)
      setSavedContent(editedContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving content:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isEditing,
    editedContent,
    isSaving,
    savedContent,
    handleEditClick,
    handleCancelClick,
    handleSave,
    setEditedContent,
  }
}

export const EditableContent = ({
  content,
  suggestionId,
  className,
  children,
}: EditableContentProps) => {
  const {
    isEditing,
    editedContent,
    isSaving,
    savedContent,
    handleEditClick,
    handleCancelClick,
    handleSave,
    setEditedContent,
  } = useEditableContent(content)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.sectionTitle}>Content</div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className={styles.editButton}
            aria-label="Edit content"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form action={handleSave} className={styles.form}>
          <input type="hidden" name="suggestionId" value={suggestionId} />
          <textarea
            name="content"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={`${styles.contentTextarea} ${className || ''}`}
            rows={10}
          />
          <div className={styles.actionButtons}>
            <button
              type="button"
              onClick={handleCancelClick}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        children(isEditing, savedContent)
      )}
    </div>
  )
}
