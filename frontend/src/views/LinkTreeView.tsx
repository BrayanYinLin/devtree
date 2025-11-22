import { useEffect, useState } from 'react'
import { social } from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { isValidUrl } from '../utils'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/DevTreeAPI'
import type { SocialNetwork, User } from '../types'

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (e) => {
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.success('Actualizado correctamente')
    }
  })

  useEffect(() => {
    let index = 1

    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      )

      if (userLink) {
        return { ...item, url: userLink.url, enable: userLink.enable, id: index++ }
      }

      return item
    })

    console.log(updatedData)
    setDevTreeLinks(updatedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    )

    setDevTreeLinks(updatedLinks)
  }

  const handleEnableLink = (socialNetwork: string) => {
    const item = devTreeLinks.find((l) => l.name === socialNetwork)
    if (!item) return

    if (!isValidUrl(item.url)) {
      toast.error('URL inválida')
      return
    }

    const updatedDevTreeLinks = devTreeLinks.map((l) =>
      l.name === socialNetwork ? { ...l, enable: !l.enable } : l
    )

    setDevTreeLinks(updatedDevTreeLinks)

    let index = 1

    const enabledLinksWithIds = updatedDevTreeLinks.map((l) => {
      if (l.enable) {
        return {
          ...l,
          id: index++
        }
      }

      return l
    })

    queryClient.setQueryData(['user'], (prev: User) => ({
      ...prev,
      links: JSON.stringify(enabledLinksWithIds)
    }))
  }
  return (
    <div className="space y-5">
      {devTreeLinks.map((item) => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}
      <button
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold"
        onClick={() => mutate(user)}
      >
        Guardar cambios
      </button>
    </div>
  )
}
