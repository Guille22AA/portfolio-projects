package anime_arena;
import java.util.InputMismatchException;
import java.util.Scanner;

import personajes.Chrollo;
import personajes.Kurapika;
import personajes.Trunks;
import personajes.Yami;
import tools.Habilidad;
import tools.Instrucciones;
import tools.Personaje;
import tools.Interfaz_kits.Kit;



/**
 * Clase principal del programa ANIME ARENA.
 * 
 * Gestiona el menú principal, la selección de personajes y el acceso
 * a las instrucciones y al sistema de combate del juego.
 * 
 * Contiene el método main() y todas las interacciones iniciales con el usuario.
 * 
 * @author Guille
 */

public class Main_menu {

	
    /**
     * Método principal del programa.
     * Crea un Scanner y lanza el menú principal.
     */
	public static void main(String[] args) {
		 Scanner sc = new Scanner(System.in);
		mostrarMenuMain(sc);
	}
	
	
    /**
     * Muestra el menú principal del juego.
     * Permite seleccionar: jugar, leer instrucciones o salir.
     *
     * Controla excepciones por entrada no válida.
     *
     * @param sc Scanner para leer entrada del jugador
     */
	public static void mostrarMenuMain(Scanner sc){
		int opcion;
			System.out.println("\n\n--ANIME ARENA--\n\n 1.Jugar\n 2.Instrucciones\n 3.Salir\n");
			
			/**
			 * 
			 */
			try {
				 opcion = sc.nextInt();
			}catch (InputMismatchException e) {
				System.err.println("Opción no válida\n");
				sc.nextLine(); //limpiar buffer
				mostrarMenuMain(sc);
				 return;
			}
			switch (opcion) {
			case 1:
				elegiPersonaje(sc);
				break;
			case 2: 
				Instrucciones.mostrarInstrucciones(); 
				break;
			case 3:
				break;
			default:
				System.err.println("Opción no válida\n");
				mostrarMenuMain(sc);
				break;
			}
		}

	
    /**
     * Muestra el menú de selección de personaje.
     * Permite ver estadísticas, habilidades y elegir con quién jugar.
     *
     * Controla excepciones de entrada no numérica.
     *
     * @param sc Scanner para leer entrada del jugador
     */
	public static void elegiPersonaje(Scanner sc) {
		int opcion = 0;
		System.out.println("\n--SELECCIÓN DE PERSONAJE--\nSellecciona un personaje para ver sus estadísticas y habilidades.\n\n 1.Chrollo Lucilfer\n 2.Trunks Brief\n 3.Yami Sukeiro\n 4.Kurapika\n\n 0.Volver\n");
		
		try {
			 opcion = sc.nextInt();
		}catch (InputMismatchException e) {
			System.err.println("Opción no válida\n");
			sc.nextLine(); //limpiar buffer
			mostrarMenuMain(sc);
			 
		}
		
		switch (opcion) {
		
		//---CHROLLO---
		case 1:
			Chrollo chrolloMenu = new Chrollo();
			
		    System.out.println("\n"+chrolloMenu.getChrollo().getStats());
		    
		    System.out.println("\n--- HABILIDADES ---");
		    Habilidad[] hbCh = chrolloMenu.getHabilidades().mostrarHabilidades();

		    System.out.println("Habilidad 1 -> " + hbCh[0]);
		    System.out.println("Habilidad 2 -> " + hbCh[1]);
		    System.out.println("Habilidad 3 -> " + hbCh[2]);
		    System.out.println("Ultimate -> " + hbCh[3]);
		    
		    System.out.println("\n1. Jugar con Chrollo");
		    System.out.println("2. Volver\n");

		    int opcionCh = sc.nextInt();
		    
		    if (opcionCh == 1) {
		    	Chrollo Ch = new Chrollo();
		    	Personaje player = Ch.getChrollo();
		    	Kit playerKit = Ch.getHabilidades();
		    	Arena_combate.iniciarCombate(player, playerKit, sc);
		    	
		    	//cuando acabe el combate, volver al menú principal
		        mostrarMenuMain(sc);
		    } else {
		    	elegiPersonaje(sc);
		    }
		    break;
		    
		//---TRUNKS---    
		case 2:
			Trunks trunksMenu = new Trunks();

		    System.out.println("\n"+trunksMenu.getTrunks().getStats());

		    System.out.println("\n--- HABILIDADES ---");
		    Habilidad[] hbTr = trunksMenu.getHabilidades().mostrarHabilidades();

		    System.out.println("Habilidad 1 -> " + hbTr[0]);
		    System.out.println("Habilidad 2 -> " + hbTr[1]);
		    System.out.println("Habilidad 3 -> " + hbTr[2]);
		    System.out.println("Ultimate -> " + hbTr[3]);
		    
		    System.out.println("\n1. Jugar con Trunks");
		    System.out.println("2. Volver\n");

		    int opcionTr = sc.nextInt();
		    
		    if (opcionTr == 1) {
		    	Trunks Tr = new Trunks();
		    	Personaje player = Tr.getTrunks();
		    	Kit playerKit = Tr.getHabilidades();
		    	Arena_combate.iniciarCombate(player, playerKit, sc);
		    	mostrarMenuMain(sc);
		    } else {
		    	elegiPersonaje(sc);
		    }
		    break;
		    
		 //---YAMI---   
		case 3:
			Yami yamiMenu = new Yami();

		    System.out.println("\n"+yamiMenu.getYami().getStats());

		    System.out.println("\n--- HABILIDADES ---");
		    Habilidad[] hbYa = yamiMenu.getHabilidades().mostrarHabilidades();

		    System.out.println("Habilidad 1 -> " + hbYa[0]);
		    System.out.println("Habilidad 2 -> " + hbYa[1]);
		    System.out.println("Habilidad 3 -> " + hbYa[2]);
		    System.out.println("Ultimate -> " + hbYa[3]);
		    
		    System.out.println("\n1. Jugar con Yami");
		    System.out.println("2. Volver\n");

		    int opcionYa = sc.nextInt();
		    
		    if (opcionYa == 1) {
		    	Yami Ya = new Yami();
		    	Personaje player = Ya.getYami();
		    	Kit playerKit = Ya.getHabilidades();
		    	Arena_combate.iniciarCombate(player, playerKit, sc);
		    	mostrarMenuMain(sc);
		    } else {
		    	elegiPersonaje(sc);
		    }
		    break;
		  
		//---KURAPIKA---    
		case 4 :
			Kurapika kurapikaMenu = new Kurapika();

		    System.out.println("\n"+kurapikaMenu.getKurapika().getStats());

		    System.out.println("\n--- HABILIDADES ---");
		    Habilidad[] hbKu = kurapikaMenu.getHabilidades().mostrarHabilidades();

		    System.out.println("Habilidad 1 -> " + hbKu[0]);
		    System.out.println("Habilidad 2 -> " + hbKu[1]);
		    System.out.println("Habilidad 3 -> " + hbKu[2]);
		    System.out.println("Ultimate -> " + hbKu[3]);
		    
		    System.out.println("\n1. Jugar con Kurapika");
		    System.out.println("2. Volver\n");

		    int opcionKu = sc.nextInt();
		    
		    if (opcionKu == 1) {
		    	Kurapika Ku = new Kurapika();
		    	Personaje player = Ku.getKurapika();
		    	Kit playerKit = Ku.getHabilidades();
		    	Arena_combate.iniciarCombate(player, playerKit, sc);
		    	mostrarMenuMain(sc);
		    } else {
		    	elegiPersonaje(sc);
		    }
		    break;
		   
		 default:
			System.err.println("Opción no válida\n");
			elegiPersonaje(sc);
			break;
		}
		
	}
	
	


}
