import { create } from 'zustand'

export const usePortStore = create((set) => ({
  vessels: [],
  berthAssignments: [],
  
  // Actions
  setVessels: (data) => set({ vessels: data }),
  setBerthAssignments: (data) => set({ berthAssignments: data }),

  updateVesselBerth: (vesselName, newBerth) => set((state) => {
    // 1. Update vessel list
    const updatedVessels = state.vessels.map(v => 
      v.name.includes(vesselName) ? { ...v, berth: newBerth, status: 'In Transit / Rerouted' } : v
    );

    // 2. Update 72h plan grid
    const updatedBerthAssignments = state.berthAssignments.map(b => {
      // Very naive logic to just demonstrate dynamic updates in the UI
      if (b.berth.includes(newBerth)) {
        return {
          ...b,
          s1: { vessel: vesselName, cranes: 2, status: 'Rerouted Arrival', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' }
        }
      }
      return b;
    });

    return { vessels: updatedVessels, berthAssignments: updatedBerthAssignments };
  })
}))
