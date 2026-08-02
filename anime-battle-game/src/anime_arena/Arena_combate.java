package anime_arena;

import java.util.Random;
import anime_arena.Main_menu;
import personajes.Chrollo;
import personajes.Kurapika;
import personajes.Trunks;
import personajes.Yami;
import tools.EfectosDeHabilidad;
import tools.Enemigo_generado;
import tools.Habilidad;
import tools.Personaje;
import tools.Interfaz_kits.Kit;
import java.util.Scanner;


/**
* Clase que gestiona todo el sistema de combate del juego: turnos,
* aplicación de habilidades, efectos temporales y selección al azar de personaje enemigo.
*/
public class Arena_combate {
	
	/** Efecto SLOW aplicado al jugador */
	private static double slowPlayer = 0;
	/** Efecto STUN aplicado al jugador */
	private static boolean stunPlayer = false;
	/** Cantidad de scudo activo del jugador (el valor es el daño que mitiga) */
	private static int escudoPlayer = 0;
	/** Bonus de daño basado en daño del enemigo */
	private static double bonusDanyoPlayer = 0;
	/** Daño por turnos aplicado al jugador */
	private static int dotPlayerDanyo = 0;
	/** Turnos restantes del daño prolongado sobre jugador */
	private static int dotPlayerTurnos = 0;
	/** Bonus de velocidad del jugador */
	private static double bonusVelocidadPlayer = 0;
	
	/** Efecto SLOW aplicado a la CPU */
	private static double slowCPU = 0;
	/** Efecto STUN aplicado a la CPU */
	private static boolean stunCPU  = false;
	/** Cantidad de escudo activo de la CPU */
	private static int escudoCPU  = 0;
	/** Bonus de daño basado en daño del jugador */
	private static double bonusDanyoCPU = 0;
	/** Daño por turnos aplicado a la CPU */
	private static int dotCPUDanyo = 0;
	/** Turnos restantes del daño prolongado sobre CPU */
	private static int dotCPUTurnos = 0;
	/** Bonus de velocidad de la CPU */
	private static double bonusVelocidadCPU = 0;
	
	
	/** Control interno usado por Chrollo para robar ultimate */
	private static boolean ultiRobada = false;
	/** Almacena ultimate robada temporalmente */
	private static Habilidad ultiRealRobada = null;
	

	/**
	* Selecciona un enemigo aleatorio diferente al personaje del jugador.
	* @param player Personaje elegido por el jugador.
	* @return Enemigo_generado que contiene el personaje CPU y su kit.
	*/
	public static Enemigo_generado enemigoRandom(Personaje player) {
		Random random = new Random();
		Personaje CPU=null;
		Kit CPUkit = null;
		
		/** Alamcena el nombre del personaje del jugador, para desctarlo como opción para la CPU. */
		String personajePlayer = player.getNombre();
		
	    /** Lista de posibles opciones. */
		Chrollo Ch = new Chrollo();
	    Trunks Tr = new Trunks();
	    Yami Ya = new Yami();
	    Kurapika Ku = new Kurapika();
	    
	    /** Bucle para seleccionar un personaje diferente al seleccionado por el jugador. */
	    while (CPU == null || CPU.getNombre().equals(player.getNombre())) {

	        int opcion = random.nextInt(4); // 0 a 3

	        switch (opcion) {
	            case 0:
	            	CPU = Ch.getChrollo();
	            	CPUkit = Ch.getHabilidades();
	            	break;
	            case 1:
	            	CPU = Tr.getTrunks();
	            	CPUkit = Tr.getHabilidades();
	            	break;
	            case 2:
	            	CPU = Ya.getYami();
	            	CPUkit = Ya.getHabilidades();
	            	break;
	            case 3:
	            	CPU = Ku.getKurapika();
	            	CPUkit = Ku.getHabilidades();
	            	break;
	        }
	    }
		
	    return new Enemigo_generado(CPU, CPUkit);
	}
	
	/**
	* Método principal que ejecuta el bucle de combate.
	* Gestiona turnos, velocidad, aplicación de estados y final del combate.
	*
	* @param player Personaje del jugador
	* @param playerKit Kit de habilidades del jugador
	* @param sc Scanner Entradas por teclado del jugador
	*/
	public static void iniciarCombate(Personaje player, Kit playerKit, Scanner sc) {
		
	    /** Obtiene al enemigo aleatorio. */
	    Enemigo_generado ene = enemigoRandom(player);
	    Personaje CPU = ene.getEnemigo();
	    Kit CPUkit = ene.getKit();
	    
		/** Obtiene las vidas iniciales, por si se tuviese que calcular el efecto EJECUTAR. */
		double vidaMaxPlayer = player.getVida();
		double vidaMaxCPU = CPU.getVida();
	    
	    //mensaje inicial
	    System.out.println("\n\nTe enfrentas a: " + CPU.getNombre() + "\n\n¡COMIENZA EL COMBATE!\n");
	    
	    /** Bucle que gestiona todo el sistema de turnos mientras ambos personajes estén vivos. */
	    while(player.estaVivo() && CPU.estaVivo()) {
	        
	        /** Variables auxiliares dado que la velocidad puede variar en cada ronda. */
	        double velPlayerRonda = player.getVelocidad();
	        double velCPURonda = CPU.getVelocidad();

	        /** Aplicar SLOW */
	        if (slowPlayer > 0.0) velPlayerRonda *= slowPlayer;
	        if (slowCPU > 0.0) velCPURonda *= slowCPU;

	        /** Aplicar Bonus de Velocidad */
	        if (bonusVelocidadPlayer > 0.0) velPlayerRonda *= (1 + bonusVelocidadPlayer);
	        if (bonusVelocidadCPU > 0.0) velCPURonda *= (1 + bonusVelocidadCPU);
	        

	        /** Condicional que gestiona el orden de los turnos. */
	        if (velPlayerRonda >= velCPURonda) {

	            /** Comprobación de que el jugador no se encuentre afectado por el efecto Stun. */
	            if (stunPlayer) {
	                System.out.println("\n¡Estás aturdido! Pierdes tu turno.");
	                stunPlayer = false; 
	            } else {
	                turnoPlayer(player, CPU, playerKit, CPUkit, sc, vidaMaxCPU);
	            }
	            if(!CPU.estaVivo()) break;


	            /** Comprobación de que el enemigo no se encuentre afectado por el efecto Stun. */
	            if (stunCPU) {
	                System.out.println("\nEl enemigo está aturdido. Pierde su turno.");
	                stunCPU = false; 
	            } else {
	                turnoCPU(CPU, player, CPUkit, playerKit, sc, vidaMaxPlayer);
	            }
	            if(!player.estaVivo()) break;

	        } else {

	            /** Caso del enemigo comenzando el turno. */
	            if (stunCPU) {
	                System.out.println("\nEl enemigo está aturdido. Pierde su turno.");
	                stunCPU = false;
	            } else {
	                turnoCPU(CPU, player, CPUkit, playerKit, sc, vidaMaxPlayer);
	            }
	            if(!player.estaVivo()) break;

	            /** Turno del jugador. */
	            if (stunPlayer) {
	                System.out.println("\n¡Estás aturdido! Pierdes tu turno.");
	                stunPlayer = false;
	            } else {
	                turnoPlayer(player, CPU, playerKit, CPUkit, sc, vidaMaxPlayer);
	            }
	            if(!CPU.estaVivo()) break;
	        }
	        
	        /** Daño provocado por el efecto Dos Turnos (DOT) (jugador sobre CPU). */
	        if (dotPlayerTurnos > 0) {
	            CPU.recibirDanyo(dotPlayerDanyo);
	            dotPlayerTurnos--;

	            System.out.println("El efecto prolongado hace " 
	                                + dotPlayerDanyo + " de daño al enemigo.");
	        }
	        
	        /** Daño provocado por el efecto Dos Turnos (DOT) (jugador sobre CPU). */
	        if (dotCPUTurnos > 0) {
	            player.recibirDanyo(dotCPUDanyo);
	            dotCPUTurnos--;

	            System.out.println("Recibes " 
	                                + dotCPUDanyo + " de daño por un efecto prolongado.");
	        }
	        

	        /** Muestreo de vida y maná de cada jugador al final de cada ronda. */
	        mostrarEstado(player, CPU);
	    }
	    
	    if (!player.estaVivo()) {
	        System.out.println("\nHas perdido el combate...");
	    } else {
	        System.out.println("\n¡Has ganado el combate!");
	    }
	}
	
	
	/**
	* Gestiona el turno del jugador: selección de habilidades,
	* gestión de maná, aplicación de efectos, cálculo de daño
	* y detención si el jugador no puede actuar.
	* 
	* @param player Personaje del jugador.
	* @param CPU Personaje enemigo.
	* @param playerKit Kit de habilidades del jugador.
	* @param CPUkit Kit de habilidades del enemigo.
	* @param sc Entradas por teclado del jugador.
	* @param vidaMaxCPU Vida máxima del enemigo.
	*/
	private static void turnoPlayer(Personaje player, Personaje CPU, Kit playerKit, Kit CPUkit, Scanner sc, double vidaMaxCPU) {
		System.out.println("\n--- TU TURNO ---\nVida actual: "+player.getVida()+"\nManá actual: "+player.getMana());
		
		 Habilidad[] habilidades = playerKit.getHabilidades();
		 	
		    /** Comprobación de que el jugador tenga maná suficiente para usar alguna habilidad. */
		    boolean puedeUsarAlgo = false;
		    for (Habilidad h : habilidades) {
		        if (player.getMana() >= h.getMana()) {
		            puedeUsarAlgo = true;
		            break;
		        }
		    }

		    /**De no tener maná, realizará un ataque básico. */
		    if (!puedeUsarAlgo) {
		        System.out.println("\nNo tienes maná para ninguna habilidad. Ataque básico automático.");

		        double danyo = player.ataqueBasico();
		        CPU.recibirDanyo(danyo);

		        System.out.println("\nAtaque básico -> " + danyo + " de daño.");
		        return;
		    }
		    
		    /** Muestreo de las opciones del jugador. */
		    System.out.println("\nElige una acción:");
		    System.out.println("0. Ataque básico (no gasta maná)");
		    System.out.println("1. " + habilidades[0].toString());
		    System.out.println("2. " + habilidades[1].toString());
		    System.out.println("3. " + habilidades[2].toString());
		    System.out.println("4.ULTIMATE. " + habilidades[3].toString()+"\n");
		    
		    int opcion = sc.nextInt();
		    Habilidad usada;
		    
		    /** Opción de ataque básico. */
		    if (opcion == 0) {
		        double danyo = player.ataqueBasico();
		        
		        /** Aplicación de Escudo, si lo hubiese. */
		        if (escudoCPU > 0) {
		            int reduccion = (int) Math.min(danyo, escudoCPU);
		            danyo -= reduccion;
		            escudoCPU -= reduccion;
		            System.out.println("El escudo del enemigo absorbió " + reduccion + " de daño.");
		        }
		        
		        CPU.recibirDanyo(danyo);
		        System.out.println("\nAtaque básico ->" + danyo + " de daño.");
		        return;
		    }
		    
		    /** Entrada por teclado inválida vuelve a mostrar las opciones. */
		    if (opcion < 1 || opcion > 4) {
		        System.out.println("\nOpción inválida, elige de nuevo.");
		        turnoPlayer(player, CPU, playerKit, CPUkit, sc, vidaMaxCPU);
		        return;
		    }
		    
		    /** Selección de habilidad. */
		    usada = habilidades[opcion - 1];
		    
		    /** Comprobación de la disponibilidad de la Ultimate */
		    if (opcion == 4 && playerKit.isUltiUsada()) {
		        System.out.println("\nYa usaste tu Ultimate. Elige otra acción.");
		        turnoPlayer(player, CPU, playerKit, CPUkit, sc, vidaMaxCPU);
		        return;
		    }
		    
		    /** De no tener suficiente maná, vuelve a elegir otra habilidad. */
		    if (player.getMana() < usada.getMana()) {
		        System.out.println("\nNo tienes maná suficiente para esa habilidad.");
		        turnoPlayer(player, CPU, playerKit, CPUkit, sc, vidaMaxCPU);
		        return;
		    }
		    
		    /** Consumición del maná de la habilidad. */
		    player.setMana(player.getMana() - usada.getMana());
		    
		    if (opcion == 4) {
		        playerKit.marcarUltiUsada();
		    }
		    
		    /** Aplicación del daño de la habilidad. */
		    double danyo = usada.getDanyo();
		    
		    /** Aplicación del Escudo de la CPU, si lo hubiese, antes de recibir el daño. */
		    if (escudoCPU > 0) {
		        int reduccion = (int) Math.min(danyo, escudoCPU);
		        danyo -= reduccion;
		        escudoCPU -= reduccion;
		        System.out.println("El escudo del enemigo absorbió " + reduccion + " de daño.");
		    }
		    
		    CPU.recibirDanyo(danyo);
		    
		    System.out.println("\nUsaste " + usada.getNombre() + " -> " + danyo + " de daño.");
		    
		    /** <b>APLICACIÓN DE EFECTOS DE HABILIDAD<b> */
		    
		    /** Slow. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.SLOW) {
		        slowCPU = usada.getValorEfecto() / 100.0;  
		        System.out.println("Has aplicado SLOW. Velocidad del enemigo reducida un " + usada.getValorEfecto() + "% un turno.\n");
		    }
		    
		    /** Bonus de Velocidad. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.BONUS_VELOCIDAD) {
		        bonusVelocidadPlayer = usada.getValorEfecto() / 100.0;
		        System.out.println("Has ganado un bonus de velocidad del " + usada.getValorEfecto() + "% para esta ronda.");
		    }
		   
		    /** Escudo. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.ESCUDO) {
		        escudoPlayer = usada.getValorEfecto();
		        System.out.println("Has generado un escudo de " + escudoPlayer + " puntos para esta ronda.");
		    }
		    
		    /** Stun. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.STUN) {
		        stunCPU = true;
		        System.out.println("¡Has inmovilizado a " + CPU.getNombre()+"! El enemigo perderá su siguiente turno.");
		    }
		    
		    /** Heal. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.HEAL) {
		    	int curacion = usada.getValorEfecto();
		        double vidaAntes = player.getVida();

		        player.setVida(player.getVida() + curacion);

		        System.out.println("Te has curado " + curacion + " puntos de vida. (" 
		                           + vidaAntes + " → " + player.getVida() + ")");
		    }
		    
		    /** Bonus de Daño. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.BONUS_DANYO_BASERIVAL) {
		        double extra = CPU.getDanyoBase() * (usada.getValorEfecto() / 100.0);

		        danyo += extra;

		        System.out.println("BONUS DE DAÑO: +" + extra 
		            + " daño adicional (" + usada.getValorEfecto() + "% del daño base del enemigo).");
		    }
		    
		    /** Ejecutar. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.EJECUTAR) {

		        double porcentaje = usada.getValorEfecto() / 100.0; 

		        double vidaLimite = vidaMaxCPU * porcentaje;

		        if (CPU.getVida() <= vidaLimite) {
		            // EJECUTADO
		            CPU.setVida(0);
		            System.out.println("¡" + CPU.getNombre() + " ha sido EJECUTADO instantáneamente!");
		            return; // ya no hay más daño ni efectos
		        }

		        // si no se puede ejecutar, solo aplica el daño normal
		        System.out.println("La ejecución no fue posible. El enemigo tiene demasiada vida.");
		    }
		    
		    /** Dos Turnos (DOT). */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.DOS_TURNOS) {

		        dotPlayerTurnos = 2;  
		        dotPlayerDanyo = (int) usada.getDanyo();

		        System.out.println("Aplicaste un efecto de daño prolongado por 2 turnos (" 
		                           + usada.getDanyo() + " por turno).");
		    }
		    
		    /** Robar Ultimate. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.ROBAR_ULTI) {

		        Habilidad ultiCPU = CPUkit.getHabilidades()[3];  // la ultimate del enemigo

		        System.out.println("¡Skill Hunter! Robas la ultimate del enemigo: " + ultiCPU.getNombre());

		        // Se ejecuta la ultimate robada
		         danyo = ultiCPU.getDanyo();
		        CPU.recibirDanyo(danyo);

		        System.out.println("Ejecutas la ultimate robada y haces " + danyo + " de daño.");
		    }
		    

		    System.out.println("\nPulsa ENTER para continuar...");
		    sc.nextLine(); // limpia buffer
		    sc.nextLine(); //para el Enter
		    
		    
	}
	
	
	/**
	* Gestiona el turno del enemigo CPU: selección automática de habilidades,
	* aplicación de efectos y daño recibido por el jugador.
	* 
	* @param CPU Personaje enemigo.
	* @param player Personaje del jugador.
	* @param CPUkit Kit de habilidades del enemigo.
	* @param playerKit Kit de habilidades del jugador.
	* @param sc Entradas por teclado del jugador.
	* @param vidaMaxPlayer Vida máxima del jugador.
	* 
	*/
	private static void turnoCPU(Personaje CPU, Personaje player, Kit CPUkit, Kit playerKit, Scanner sc, double vidaMaxPlayer) {
		System.out.println("\n\n--- TURNO DEL ENEMIGO (" + CPU.getNombre() + ") ---\n");
		
		 Habilidad[] habilidades = CPUkit.getHabilidades();
		 
		    /** Comprobación de que tenga maná suficiente para usar alguna habilidad. */
		    boolean puedeUsarAlgo = false;
		    for (Habilidad h : habilidades) {
		        if (CPU.getMana() >= h.getMana()) {
		            puedeUsarAlgo = true;
		            break;
		        }
		    }
		    
		    /** De no tener maná suficiente para usar ninguna habilidad -> ataque básico. */
		    if (!puedeUsarAlgo) {
		        double danyo = CPU.ataqueBasico();
		        
		        /** Aplicación del Escudo del jugador, si lo hubiese. */
		        if (escudoPlayer > 0) {
		            int reduccion = (int) Math.min(danyo, escudoPlayer);
		            danyo -= reduccion;
		            escudoPlayer -= reduccion;
		            System.out.println("Tu escudo absorbió " + reduccion + " de daño.");
		        }
		        
		        player.recibirDanyo(danyo);
		        System.out.println(CPU.getNombre() + " hizo un ataque básico -> " + danyo + " de daño.");
		        return;
		    }
		    
		    /** Selección de una habilidad aleatoria disponible. */
		    Random r = new Random();
		    Habilidad usada = null;
		    

		    while (usada == null) {
		        int opcion = r.nextInt(4); // 0..3
		        Habilidad h = habilidades[opcion];
		        
		        if (opcion == 3 && CPUkit.isUltiUsada()) {
			        continue; //para que no pueda volver a usar la ulti
			    }

		        if (CPU.getMana() >= h.getMana()) {
		            usada = h;
		        }
		        
		        if (usada == habilidades[3]) {
		            CPUkit.marcarUltiUsada();
		        }
		    }
		    
		    /** Consumición del maná de la habilidad usada. */
		    CPU.setMana(CPU.getMana() - usada.getMana());
		    
		    /** Aplicación del daño de la habilidad usada. */
		    double danyo = usada.getDanyo();
		    
		    /** Aplicación del Escudo del jugador, si lo hubiese, antes de recibir el daño. */
		    if (escudoPlayer > 0) {
		        int reduccion = (int) Math.min(danyo, escudoPlayer);
		        danyo -= reduccion;
		        escudoPlayer -= reduccion;
		        System.out.println("Tu escudo absorbió " + reduccion + " de daño.");
		    }
		    
		    
		    player.recibirDanyo(danyo);

		    System.out.println(CPU.getNombre() + " usó " + usada.getNombre() + " -> " + danyo + " de daño.");

		    /** <b>APLICACIÓN DE EFECTOS DE HABILIDAD<b> */
		    
		    /** Slow. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.SLOW) {
		        slowPlayer = usada.getValorEfecto() / 100.0;
		        System.out.println("El enemigo te aplicó " + usada.getValorEfecto() + "% de SLOW. Tu velocidad se reduce un turno.");
		    }
		    
		    //** Bonus de Velocidad. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.BONUS_VELOCIDAD) {
		        bonusVelocidadCPU = usada.getValorEfecto() / 100.0;
		        System.out.println(CPU.getNombre() + " obtuvo un bonus de velocidad del " + usada.getValorEfecto() + "%.");
		    }
		    
		    /** Escudo. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.ESCUDO) {
		        escudoCPU = usada.getValorEfecto();
		        System.out.println(CPU.getNombre() + " obtuvo un escudo de " + escudoCPU + " puntos.");
		    }
		    
		    /** Stun. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.STUN) {
		        stunPlayer = true;
		        System.out.println(CPU.getNombre() + " te ha inmovilizado! Perderás tu siguiente turno.");
		    }
		    
		    /** Heal. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.HEAL) {
		        int curacion = usada.getValorEfecto();
		        double vidaAntes = CPU.getVida();

		        CPU.setVida(CPU.getVida() + curacion);

		        System.out.println(CPU.getNombre() + " se ha curado " + curacion 
		                           + " puntos. (" + vidaAntes + " → " + CPU.getVida() + ")");
		    }
		    
		    /** Bonus de Daño. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.BONUS_DANYO_BASERIVAL) {

		        double extra = player.getDanyoBase() * (usada.getValorEfecto() / 100.0);

		        danyo += extra;

		        System.out.println(CPU.getNombre() + " obtuvo BONUS DAÑO: +" + extra 
		            + " daño adicional.");
		    }
		    
		    /** Ejecutar. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.EJECUTAR) {

		        double porcentaje = usada.getValorEfecto() / 100.0;
		        double vidaLimite = vidaMaxPlayer * porcentaje;

		        if (player.getVida() <= vidaLimite) {
		            player.setVida(0);
		            System.out.println("¡Has sido EJECUTADO por " + CPU.getNombre() + "!");
		            return;
		        }

		        System.out.println(CPU.getNombre() + " intentó ejecutar, pero no cumplías la condición.");
		    }
		    
		    /** Dos Turnos (DOT). */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.DOS_TURNOS) {

		        dotCPUTurnos = 2;
		        dotCPUDanyo = (int) usada.getDanyo();

		        System.out.println(CPU.getNombre() + " aplicó daño prolongado por 2 turnos ("
		                           + usada.getDanyo() + " por turno).");
		    }
		    
		    /** Robar  Ultimate. */
		    if (usada.getTipoEfecto() == EfectosDeHabilidad.ROBAR_ULTI) {

		        Habilidad ultiPlayer = playerKit.getHabilidades()[3];

		        System.out.println("¡Skill Hunter! Robas la ultimate del enemigo: " + ultiPlayer.getNombre());

		        //se ejecuta la ultimate robada
		         danyo = ultiPlayer.getDanyo();
		        CPU.recibirDanyo(danyo);

		        System.out.println("Ejecutas la ultimate robada y haces " + danyo + " de daño.");
		    }
		    
		    System.out.println("\nPulsa ENTER para continuar...");
		    sc.nextLine();
		    sc.nextLine();
		    
	}
	
	
	/**
	* Muestra vida y maná actuales del jugador y la CPU.
	* @param player Personaje del jugador
	* @param CPU Personaje enemigo.
	*/
	private static void mostrarEstado(Personaje player, Personaje CPU) {
	    System.out.println("\n----- ESTADO ACTUAL -----\n");
	    System.out.println(player.getNombre() + ": Vida = " + player.getVida() + " | Maná = " + player.getMana());
	    System.out.println(CPU.getNombre() + ": Vida = " + CPU.getVida() + " | Maná = " + CPU.getMana());
	    System.out.println("--------------------------\n");
	}
	

	/**
	* Limpia los efectos que duran solo un turno y actualiza duración de DOT.
	*/
	private static void actualizarEstados() {
		
	    slowPlayer = 0;
	    slowCPU = 0;

	    bonusVelocidadPlayer = 0;
	    bonusVelocidadCPU = 0;

	    bonusDanyoPlayer = 0;
	    bonusDanyoCPU = 0;

	    escudoPlayer = 0;
	    escudoCPU = 0;

	    stunPlayer = false;
	    stunCPU = false;

	    if (dotPlayerTurnos > 0) dotPlayerTurnos--;
	    if (dotCPUTurnos > 0) dotCPUTurnos--;

	    if (dotPlayerTurnos == 0) dotPlayerDanyo = 0;
	    if (dotCPUTurnos == 0) dotCPUDanyo = 0;
		
	}
}
