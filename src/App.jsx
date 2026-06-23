import Welcomer from './components/Welcomer.jsx'

export default function App() {
  // The Welcomer is a staff-held iPad app. Full-bleed on a real tablet; on
  // desktop/projector it floats as a framed tablet on a branded stage.
  return (
    <div className="device-stage relative min-h-full w-full md:flex md:min-h-screen md:items-center md:justify-center md:p-6">
      <div className="dotgrid pointer-events-none absolute inset-0 hidden opacity-70 md:block" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[820px] flex-col bg-cloud no-scrollbar md:h-auto md:max-h-[calc(100vh-3rem)] md:min-h-0 md:overflow-y-auto md:rounded-[2rem] md:shadow-pop md:ring-1 md:ring-black/10">
        <Welcomer />
      </div>
    </div>
  )
}
