import React, { Fragment } from 'react'
import { fromProvider } from 'cloud-regions-country-flags'

const Page = ({ status, data }) => {
  if (status === 'error') return <div>Error</div>

  return (
    <main style={{ fontFamily: 'system-ui' }}>
      <dl>
        {data.clusters.map((cluster, index) => {
          const { name, cloud_provider, regions } = cluster
          return (
            <Fragment key={index}>
              <dt style={{ margin: '16px 0px 8px 0px' }}>{name}</dt>
              {regions.map((region, index) => {
                const { name } = region
                const { flag, location } = fromProvider(name, cloud_provider)
                return (
                  <Fragment key={index}>
                    <dd>
                      <strong>Flag:</strong> <span style={{ fontFamily: 'color-emoji' }}>{flag}</span>
                    </dd>
                    <dd>
                      <strong>Location:</strong> {location}
                    </dd>
                    <dd>
                      <strong>Region Name:</strong> {name}
                    </dd>
                    <dd>
                      <strong>Provider:</strong> {cloud_provider}
                    </dd>
                  </Fragment>
                )
              })}
            </Fragment>
          )
        })}
      </dl>
    </main>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch('https://cockroachlabs.cloud/api/v1/clusters', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.COCKROACH_CLOUD_SECRET_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error('Bad Response')
    }

    const json = await response.json()

    return {
      props: {
        status: 'success',
        data: json
      }
    }
  } catch (error) {
    return {
      props: {
        status: 'error',
        error: error.message
      }
    }
  }
}

export default Page
