import type { ACLObj } from 'src/configs/acl'
import type { ReactElement, ReactNode } from 'react'
import type { NextComponentType, NextPageContext } from 'next/dist/shared/lib/utils'

declare module 'next' {
    export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
        acl?: ACLObj
        authGuard?: boolean
        guestGuard?: boolean
        setConfig?: () => void
        contentHeightFixed?: boolean
        getLayout?: (page: ReactElement) => ReactNode
    }
    export declare type GetServerSidePropsContext<
        Params extends ParsedUrlQuery = ParsedUrlQuery,
        Preview extends PreviewData = PreviewData
    > = {
        req: IncomingMessage & {
            cookies: NextApiRequestCookies
        }
        res: ServerResponse
        params?: Params
        query: ParsedUrlQuery
        preview?: boolean
        previewData?: Preview
        resolvedUrl: string
        locale?: string
        locales?: string[]
        defaultLocale?: string
    }
}
