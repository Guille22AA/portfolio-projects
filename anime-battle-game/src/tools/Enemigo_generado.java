package tools;

import tools.Interfaz_kits.Kit;

/**
 * Clse auxiliar que epresenta un enemigo generado aleatoriamente para un combate,
 * junto con su conjunto de habilidades (kit).
 * <p>
 * Esta clase actúa como un contenedor que agrupa:
 * <ul>
 *     <li>El personaje enemigo seleccionado</li>
 *     <li>El kit correspondiente al enemigo</li>
 * </ul>
 * Ambos elementos se entregan juntos porque cada enemigo debe
 * poseer su propio personaje y su propio set de habilidades.
 */
public class Enemigo_generado {

	/** Personaje enemigo generado. */
    private final Personaje CPU;
    
    /** Kit de habilidades del enemigo. */
    private final Kit CPUkit;

    /**
     * Construye un nuevo enemigo junto con su kit.
     *
     * @param enemigo El personaje enemigo generado aleatoriamente.
     * @param kit     El conjunto de habilidades que utilizará el enemigo.
     */
    public Enemigo_generado(Personaje CPU, Kit CPUkit) {
        this.CPU = CPU;
        this.CPUkit = CPUkit;
    }
    
    /**
     * Obtiene el personaje enemigo.
     *
     * @return El {@link Personaje} enemigo.
     */
    public Personaje getEnemigo() {
        return CPU;
    }

    /**
     * Obtiene el kit de habilidades del enemigo.
     *
     * @return El {@link Kit} correspondiente al enemigo.
     */
    public Kit getKit() {
        return CPUkit;
    }
}
